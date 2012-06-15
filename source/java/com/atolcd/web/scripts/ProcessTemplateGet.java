package com.atolcd.web.scripts;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.admin.SysAdminParams;
import org.alfresco.repo.template.DateCompareMethod;
import org.alfresco.repo.template.HasAspectMethod;
import org.alfresco.repo.template.I18NMessageMethod;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.repository.TemplateService;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.cmr.security.AuthenticationService;
import org.alfresco.service.cmr.security.PersonService;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.util.UrlUtil;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.util.Assert;

public class ProcessTemplateGet extends DeclarativeWebScript implements InitializingBean {
	private NodeService nodeService;
	private TemplateService templateService;
	private SearchService searchService;
	private PersonService personService;
	private AuthenticationService authenticationService;
	private NamespaceService namespaceService;
	private ServiceRegistry serviceRegistry;
	private SysAdminParams sysAdminParams;

	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}

	public void setTemplateService(TemplateService templateService) {
		this.templateService = templateService;
	}

	public void setSearchService(SearchService searchService) {
		this.searchService = searchService;
	}

	public void setPersonService(PersonService personService) {
		this.personService = personService;
	}

	public void setAuthenticationService(AuthenticationService authenticationService) {
		this.authenticationService = authenticationService;
	}

	public void setNamespaceService(NamespaceService namespaceService) {
		this.namespaceService = namespaceService;
	}

	public void setServiceRegistry(ServiceRegistry serviceRegistry) {
		this.serviceRegistry = serviceRegistry;
	}

	public void setSysAdminParams(SysAdminParams sysAdminParams) {
		this.sysAdminParams = sysAdminParams;
	}

	public void afterPropertiesSet() throws Exception {
		Assert.notNull(nodeService);
		Assert.notNull(templateService);
		Assert.notNull(searchService);
		Assert.notNull(personService);
		Assert.notNull(authenticationService);
		Assert.notNull(namespaceService);
		Assert.notNull(serviceRegistry);
		Assert.notNull(sysAdminParams);
	}

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache) {
		try {
			String nodeRefStr = req.getParameter("nodeRef"), templateGenerated = null;
			if (nodeRefStr != null) {
				NodeRef nodeFolder = new NodeRef(nodeRefStr);
				if (nodeService.exists(nodeFolder)) {
					NodeRef template = (NodeRef) nodeService.getProperty(nodeFolder, ContentModel.PROP_TEMPLATE);
					if (template != null) {
						NodeRef person = null, companyhome = null, userhome = null;
						String userName = authenticationService.getCurrentUserName();
						if (userName != null) {
							person = personService.getPerson(userName);
							if (person != null) {
								userhome = (NodeRef) nodeService.getProperty(person, ContentModel.PROP_HOMEFOLDER);
							} else {
								throw new WebScriptException("Person not found.");
							}
						} else {
							throw new WebScriptException("UserName not found.");
						}

						StoreRef storeRef = new StoreRef(StoreRef.PROTOCOL_WORKSPACE, "SpacesStore");
						List<NodeRef> refs = searchService.selectNodes(nodeService.getRootNode(storeRef),
								"/app:company_home", null, namespaceService, false);
						if (refs.size() != 1) {
							throw new WebScriptException("Companyhome not found.");
						}
						companyhome = refs.get(0);

						Map<String, Object> args = templateService.buildDefaultModel(person, companyhome, userhome,
								template, null);

						args.put("document", null);
						args.put("space", nodeFolder);
						// current date/time is useful to have and isn't supplied by FreeMarker by default
						args.put("date", new Date());

						// add custom method objects
						args.put("hasAspect", new HasAspectMethod());
						args.put("message", new I18NMessageMethod());
						args.put("dateCompare", new DateCompareMethod());

						// add URLs
						args.put("url", new URLHelper(sysAdminParams));
						args.put(TemplateService.KEY_SHARE_URL,
								UrlUtil.getShareUrl(this.serviceRegistry.getSysAdminParams()));

						templateGenerated = templateService.processTemplate(template.toString(), args);
					}
				} else {
					throw new WebScriptException("Node not found.");
				}
			} else {
				throw new WebScriptException(HttpServletResponse.SC_BAD_REQUEST, "Need nodeRef.");
			}

			Map<String, Object> model = new HashMap<String, Object>();
			model.put("template", templateGenerated);

			return model;
		} catch (Exception e) {
			throw new WebScriptException("[getTemplate] Error in executeImpl function " + e.getLocalizedMessage());
		}
	}

	public static class URLHelper {
		private final SysAdminParams sysAdminParams;

		public URLHelper(SysAdminParams sysAdminParams) {
			this.sysAdminParams = sysAdminParams;
		}

		public String getContext() {
			return "/" + sysAdminParams.getAlfrescoContext();
		}

		public String getServerPath() {
			return sysAdminParams.getAlfrescoProtocol() + "://" + sysAdminParams.getAlfrescoHost() + ":"
					+ sysAdminParams.getAlfrescoPort();
		}
	}
}