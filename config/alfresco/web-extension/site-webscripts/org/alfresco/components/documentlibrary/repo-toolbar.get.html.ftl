<#include "include/toolbar.lib.ftl" />
<@toolbarTemplate>
<script type="text/javascript">//<![CDATA[
   new Alfresco.RepositoryDocListToolbar("${args.htmlid?js_string}").setOptions(
   {
      rootNode: "${rootNode!"null"}",
      hideNavBar: ${(preferences.hideNavBar!false)?string},
      googleDocsEnabled: ${(googleDocsEnabled!false)?string},
      repositoryBrowsing: ${(rootNode??)?string},
      useTitle: ${((args.useTitle!config.scoped["DocumentLibrary"]["use-title"].value)!"true")?js_string},
      createContentByTemplateEnabled: ${createContentByTemplateEnabled?string},
      createContentActions: [<#list createContent as c>
      {
         type: "${c.type!""?js_string}",
         icon: "${c.icon!""?js_string}",
         label: "${c.label!""?js_string}",
         index: ${c.index!0?js_string},
         permission: "${c.permission?js_string}",
         params: {<#list c.params?keys as p>
               "${p?js_string}": "${c.params[p]?js_string}"<#if p_has_next>,</#if>
         </#list>}
      }<#if c_has_next>,</#if>
      </#list>]
      <#-- Custom views -->
      , hideCustomView: ${(preferences.hideCustomView!false)?string}
      , customViewDisplayMode: "${config.scoped['CustomViews']['display-mode'].getChildValue('value')!'both'}"
      <#-- Space templates -->
      , spaceTemplatesDisplayMode: "${config.scoped['SpaceTemplates']['display-mode'].getChildValue('value')!'both'}"
   }).setMessages(
      ${messages}
   );
//]]></script>
</@>