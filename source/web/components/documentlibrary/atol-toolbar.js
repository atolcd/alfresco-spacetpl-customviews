// Atol namespace
if (typeof Atol == undefined || !Atol) { var Atol = {}; }
(function()
{
  /**
  * YUI Library aliases
  */
  var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      Selector = YAHOO.util.Selector;

  /**
   * Preferences
   */
  var PREFERENCES_ROOT = "com.atolcd.share.documentList",
      PREF_HIDE_CUSTOMVIEW = PREFERENCES_ROOT + ".hideCustomView";


  // Define constructor...
  Atol.DocListToolbar = function AtolDLTB_constructor(htmlId) {
    Atol.DocListToolbar.superclass.constructor.call(this, htmlId);
    return this;
  };

  // Extend default DocListToolbar
  YAHOO.extend(Atol.DocListToolbar, Alfresco.DocListToolbar,
  {
    /**
     * Fired by YUI when parent element is available for scripting.
     * Component initialisation, including instantiation of YUI widgets and event listener binding.
     *
     * @method onReady
     */
    onReady: function AtolDLTB_onReady() {
      // Call super class method...
      Atol.DocListToolbar.superclass.onReady.call(this);

      var prefs = this.services.preferences.get();
      var hideCustomViewPreference = Alfresco.util.findValueByDotNotation(prefs, PREF_HIDE_CUSTOMVIEW, null);
      if (hideCustomViewPreference !== null) {
        this.options.hideCustomView = hideCustomViewPreference;
      }

      if (
        this.options.spaceTemplatesDisplayMode != 'none' && (
          (this.options.spaceTemplatesDisplayMode == 'both') ||
          (this.options.spaceTemplatesDisplayMode == 'repository' && !this.options.siteId) ||
          (this.options.spaceTemplatesDisplayMode == 'sites' && this.options.siteId)
        )
      ) {
        var spaceTemplatesAction = '<div class="create-space">' +
           '<button id="' + this.id + '-createSpace-button" name="createSpace">' + this.msg("button.create-space") + '</button>' +
           '<div id="' + this.id + '-createSpace-menu" class="yuimenu">' +
              '<div class="bd">' +
                 '<ul>' +
                    '<li><a href="#"><span class="onNewFolder">' + this.msg("menu.create-space.folder") + '</span></a></li>' +
                    '<li><a href="#"><span class="onNewSpaceFromTemplate">' + this.msg("menu.create-space.space") + '</span></a></li>' +
                 '</ul>' +
              '</div>' +
           '</div>' +
        '</div>';

        // Create custom action element
        var div = document.createElement('div');
        div.setAttribute("class", "hideable toolbar-hidden DocListTree");
        div.innerHTML = spaceTemplatesAction;

        // Insert custom action element into the DOM
        var left = Selector.query('div .left', this.id + '-tb-body', true);
        var createFolderElt = Selector.query('div .new-folder', this.id + '-tb-body', true);

        if (createFolderElt) {
          var createFolderActionDiv = (createFolderElt.parentNode) ? createFolderElt.parentNode : null;
          if (createFolderActionDiv) {
            Dom.setStyle(createFolderActionDiv, "display", "none");
            left.insertBefore(div, createFolderActionDiv);
          }
          else {
            var separator = document.createElement('div');
            separator.setAttribute("class", "separator");
            separator.innerHTML = '&nbsp;';

            left.appendChild(separator);
            left.appendChild(div);
          }


          // New Space Templates menu button
          this.widgets.createSpace = Alfresco.util.createYUIButton(this, "createSpace-button", this.onCreateSpace,
          {
            type: "menu",
            menu: "createSpace-menu",
            lazyloadmenu: false,
            disabled: true,
            value: "CreateChildren"
          });

          this.dynamicControls.push(this.widgets.createSpace);
        }
      }

      if (
        this.options.customViewDisplayMode != 'none' && (
          (this.options.customViewDisplayMode == 'both') ||
          (this.options.customViewDisplayMode == 'repository' && !this.options.siteId) ||
          (this.options.customViewDisplayMode == 'sites' && this.options.siteId)
        )
      ) {
          // Move "customView" region between toolbar element ('tb-body') and document-list element ('dl-body')
          var elt = Dom.get(this.id + '-customView');
          if (elt && elt.parentNode) {
            var documentListBodyElt = Dom.get(this.id + '-dl-body');
            if (documentListBodyElt && documentListBodyElt.parentNode) {
              documentListBodyElt.parentNode.insertBefore(elt.parentNode, documentListBodyElt);
            }
          }

          var customViewAction = '<div class="custom-view">' +
             '<button id="' + this.id + '-customView-button" name="customView" title="' + this.msg("button.view.custom") + '">&nbsp;</button>' +
             '<div id="' + this.id + '-customView-menu" class="yuimenu">' +
                '<div class="bd">' +
                   '<ul>' +
                      '<li><a href="#"><span class="onCustomView">' + this.msg("menu.customView.settings") + '</span></a></li>' +
                      '<li><a href="#"><span id="' + this.id + '-customView-button-hide" class="onHideCustomView">' + this.msg("menu.customView.hide") + '</span></a></li>' +
                   '</ul>' +
                '</div>' +
             '</div>' +
          '</div>';

        // Create custom action element
        var div = document.createElement('div');
        div.setAttribute("class", "custom-view-menu hideable toolbar-hidden DocListTree");
        div.innerHTML = customViewAction;

        // Insert custom action element into the DOM
        var right = Selector.query('div .right', this.id + '-tb-body', true);
        var firstChildElt = (right.childNodes.length > 0) ? right.childNodes[0] : null;
        if (firstChildElt) {
          right.insertBefore(div, firstChildElt);
        }
        else {
          right.appendChild(div);
        }


        // New cutom view menu button
        this.widgets.customView = Alfresco.util.createYUIButton(this, "customView-button", this.onCreateMenu,
        {
          type: "menu",
          menu: "customView-menu",
          lazyloadmenu: false,
          disabled: true
        });
        this.dynamicControls.push(this.widgets.customView);

        // Set message of hide button
        var buttonHideMsg = this.msg(this.options.hideCustomView ? "menu.customView.show" : "menu.customView.hide");
        Dom.get(this.id + "-customView-button-hide").innerHTML = buttonHideMsg;
        if (!this.options.hideCustomView){
          Dom.addClass(this.id.replace("toolbar","customview") + "-customView", "customView-button-show");
        }
      } else {
        // Force 'hideCustomView' to true
        this.options.hideCustomView = true;
      }
    },

    /*********************************************************************************************************************/
    /********************************************* Space templates functions *********************************************/
    /*********************************************************************************************************************/
    /**
     * Selected Items button click handler
     *
     * @method onCreateSpace
     * @param sType {string} Event type, e.g. "click"
     * @param aArgs {array} Arguments array, [0] = DomEvent, [1] = EventTarget
     * @param p_obj {object} Object passed back from subscribe method
     */
    onCreateSpace: function AtolDLTB_onCreateSpace(sType, aArgs, p_obj) {
      var domEvent = aArgs[0],
        eventTarget = aArgs[1];

      // Get the function related to the clicked item
      var fn = Alfresco.util.findEventClass(eventTarget);
      if (fn && (typeof this[fn] == "function")) {
        this[fn].call(this);
      }

      if (domEvent) {
        Event.preventDefault(domEvent);
      }
    },


    /**
     * New space button click handler
     *
     * @method onNewSpaceFromTemplate
     * @param e {object} DomEvent
     * @param p_obj {object} Object passed back from addListener method
     */
    onNewSpaceFromTemplate: function AtolDLTB_onNewSpaceFromTemplate(e, p_obj) {
      var me = this;

      var createDlg = function(listTemplate, folder) {
        var createSpaceDlg = new YAHOO.widget.SimpleDialog('create-space-dialog', {
          width: "500px",
          modal:true,
          fixedcenter: true,
          draggable: false,
          constraintoviewport: true
        });

        // Header
        createSpaceDlg.setHeader(Alfresco.util.message("space.header"));

        // Create dialog div element
        var html = '<div class="spaceTemplate-container">';
        html    +=   '<label for="space-name">' + Alfresco.util.message("space.name") + '</label>';
        html    +=   '<input id="space-name" type="text" name="space-name" />';
        html    += '</div>';

        html += '<div class="spaceTemplate-container">';
        html +=   '<label for="space-template-name">' + Alfresco.util.message("space.template-name") + '</label>';
        html +=   '<select id="space-template-name" name="space-template-name">';
        html +=     listTemplate;
        html +=   '<select/>';
        html += '</div>';

        // Add DOM elements into dialog body
        createSpaceDlg.setBody(html);

        // Add buttons : cancel and create
        buttons = [
          {
            text: Alfresco.util.message("space.create"),
            handler: function() {
              var spaceName = Dom.get("space-name").value;
              var spaceTemplateNodeRef = Dom.get("space-template-name").value;

              if (spaceName != "" && spaceTemplateNodeRef != "") {
                var params = "?spaceTemplateNodeRef=" + spaceTemplateNodeRef;
                params += "&folderNodeRef="+ folder;
                params += "&spaceName="+ spaceName;

                var dlg=this;
                Alfresco.util.Ajax.request({
                  url: Alfresco.constants.PROXY_URI + "slingshot/createSpaceFromTemplate" + params,
                  method: Alfresco.util.Ajax.POST,
                  responseContentType: Alfresco.util.Ajax.JSON,
                  successCallback: {
                    fn: function (response) {
                      Alfresco.util.PopupManager.displayMessage({
                        text: me.msg("space.createSuccess", spaceName),
                        spanClass: "message"
                      });
                      dlg.destroy();
                      YAHOO.Bubbling.fire("folderCreated",
                      {
                         name: spaceName,
                         parentNodeRef: folder
                      });
                    }
                  },
                  failureCallback: {
                    fn: function (response) {
                      Alfresco.util.PopupManager.displayMessage({
                        text: response.json.message,
                        spanClass: "message"
                      });
                    }
                  }
                });
              }
              else {
                Alfresco.util.PopupManager.displayMessage({
                  text: Alfresco.util.message("space.mandatory-field"),
                  spanClass: "message"
                });
              }
            },
            isDefault:true
          },
          {
            text: Alfresco.util.message("space.cancel"),
            handler: function(){ this.destroy(); }
          }
        ];
        createSpaceDlg.cfg.queueProperty("buttons", buttons);

        // Dialog render
        createSpaceDlg.render(document.body);
      };

      var folder = this.doclistMetadata.parent.nodeRef;
      Alfresco.util.Ajax.request({
        url: Alfresco.constants.PROXY_URI + "slingshot/listSpacesTemplates",
        successCallback:
        {
          fn: function (response) {
            var listTemplate = "";
            var templates = response.json.templates;
            for(var t in templates){
              listTemplate += '<option value="' + templates[t].nodeRef + '">' + templates[t].name + '</option>';
            }
            createDlg(listTemplate, folder, me);
          }
        },
        failureMessage: Alfresco.util.message("space.errorListSpacesTemplates"),
        execScripts: true
      });
    },
    /*********************************************************************************************************************/


    /**********************************************************************************************************************/
    /*********************************************** Custom views functions ***********************************************/
    /**********************************************************************************************************************/
    /**
     * Document List Metadata event handler
     * NOTE: This is a temporary fix to enable access to the View Details action from the breadcrumb.
     *       A more complete solution is to present the full list of parent folder actions.
     *
     * @method onDoclistMetadata
     * @param layer {object} Event fired
     * @param args {array} Event parameters (depends on event type)
     * @override
     */
    onDoclistMetadata: function AtolDLTB_onDoclistMetadata(layer, args) {
      // Call super class method...
      Atol.DocListToolbar.superclass.onDoclistMetadata.call(this, layer, args);

      var obj = args[1];
      if (obj && obj.metadata) {
        var items = Dom.getElementsByClassName("onCustomView", "span", this.id + "-customView-menu");
        if (items.length == 1) {
          var item = items[0];
          if (this.doclistMetadata.parent.permissions.user.Write){
            Dom.removeClass(item, "custom-view-item-disabled");
          } else {
            Dom.addClass(item, "custom-view-item-disabled");
          }
        }
      }

      // TODO
      var cssProperties = YAHOO.lang.JSON.parse(this.options.customViewCSS);
      for (var i=0, ii=cssProperties.length ; i<ii ; i++) {
        // Set style
        Dom.setStyle(this.id + "-customViewContent", cssProperties[i].property, cssProperties[i].value);
      }

      var obj = args[1];
      if (obj) {
        if (obj.metadata.parent.nodeRef) {
          if (!this.options.hideCustomView) {
            Alfresco.util.Ajax.request({
              url: Alfresco.constants.PROXY_URI + "slingshot/processTemplate?nodeRef=" + obj.metadata.parent.nodeRef,
              successCallback: {
                fn: function (response) {
                  var template = response.serverResponse.responseText;
                  if (template != "") {
                    Dom.get(this.id + "-customViewContent").innerHTML = template;
                    Dom.removeClass(this.id + "-customView", "customView-hidden");
                  } else {
                    // No template
                    Dom.get(this.id + "-customViewContent").innerHTML = "";
                    Dom.addClass(this.id + "-customView", "customView-hidden");
                  }
                },
                scope: this
              },
              failureCallback: {
                fn: function() {
                  Dom.get(this.id + "-customViewContent").innerHTML = Alfresco.util.message("customView.errorCustomView");
                  Dom.removeClass(this.id + "-customView", "customView-hidden");
                },
                scope: this
              },
              execScripts: true
            });
          } else {
            Dom.addClass(this.id + "-customView", "customView-hidden");
          }
        } else {
          Dom.addClass(this.id + "-customView", "customView-hidden");
        }
      }
    },

    /**
     * Selected Items button click handler
     *
     * @method onCreateMenu
     * @param sType {string} Event type, e.g. "click"
     * @param aArgs {array} Arguments array, [0] = DomEvent, [1] = EventTarget
     * @param p_obj {object} Object passed back from subscribe method
     */
    onCreateMenu: function AtolDLTB_onCreateMenu(sType, aArgs, p_obj) {
      var domEvent = aArgs[0],
          eventTarget = aArgs[1];

      // Get the function related to the clicked item
      var fn = Alfresco.util.findEventClass(eventTarget);
      if (fn && (typeof this[fn] == "function")) {
        this[fn].call(this);
      }

      if (domEvent) {
        Event.preventDefault(domEvent);
      }
    },


    /**
     * Create and load custom view dialog
     *
     * @method showCustomViewDlg
     * @param e {object} DomEvent
     * @param response {object} Object passed back from successCallback method
     */
    showCustomViewDlg: function AtolDLTB_showCustomViewDlg(response) {
      var me = this;

      var customViewDlg = new YAHOO.widget.SimpleDialog('custom-view-dialog', {
        width: "500px",
        modal:true,
        fixedcenter: true,
        draggable: false,
        constraintoviewport: true
      });

      // Header
      customViewDlg.setHeader(Alfresco.util.message("view.header"));

      var templates = response.json.templates,
          templateApplied = response.json.templateApplied;

      // Create dialog div element
      var html = '<div class="viewTemplate-container">';
      html    +=   '<label for="' + this.id + '-view-template-name">' + Alfresco.util.message("view.template-name") + '</label>';
      html    +=   '<select id="' + this.id + '-view-template-name" name="view-template-name">';
      html    +=   '<option value="">' + Alfresco.util.message("view.deleteView") + '</option>';

      for (var t in templates) {
        var templateRef = templates[t].nodeRef;
        if (templateRef != templateApplied) {
          html += '<option value="' + templateRef + '">' + templates[t].name + '</option>';
        } else {
          html += '<option value="' + templateRef + '" selected="selected">' + templates[t].name + '</option>';
        }
      }
      html    +=   '<select/>';
      html    += '</div>';

      // Add DOM elements into dialog body
      customViewDlg.setBody(html);

      // Add buttons : cancel and create
      buttons = [
        {
          text: Alfresco.util.message("view.custom"),
          handler: function() {
            var selectViewTemplate = Dom.get(me.id + "-view-template-name");
            var spaceTemplateNodeRef = selectViewTemplate.value;
            var spaceTemplateName = selectViewTemplate.options[selectViewTemplate.selectedIndex].text;

            var params = "?viewTemplateNodeRef=" + spaceTemplateNodeRef;
            params += "&folderNodeRef=" + me.doclistMetadata.parent.nodeRef;

            Alfresco.util.Ajax.request({
              url: Alfresco.constants.PROXY_URI + "slingshot/customView" + params,
              method: Alfresco.util.Ajax.POST,
              responseContentType: Alfresco.util.Ajax.JSON,
              successCallback: {
                fn: function (response) {
                  Alfresco.util.PopupManager.displayMessage({
                    text: me.msg("view.createSuccess", spaceTemplateName),
                    spanClass: "message"
                  });
                  this.destroy();
                  YAHOO.Bubbling.fire("metadataRefresh");
                },
                scope:this
              },
              failureCallback: {
                fn: function (response) {
                  Alfresco.util.PopupManager.displayMessage({
                    text: response.json.message,
                    spanClass: "message"
                  });
                }
              }
            });
          },
          isDefault:true
        },
        {
          text: Alfresco.util.message("view.cancel"),
          handler: function(){ this.destroy(); }
        }
      ];
      customViewDlg.cfg.queueProperty("buttons", buttons);

      // Dialog render
      customViewDlg.render(document.body);
    },

    /**
     * Custom view button click handler
     *
     * @method onCustomView
     * @param e {object} DomEvent
     * @param p_obj {object} Object passed back from addListener method
     */
    onCustomView: function AtolDLTB_onCustomView(e, p_obj) {
      if (this.doclistMetadata.parent.permissions.user.Write) {
        Alfresco.util.Ajax.request({
          url: Alfresco.constants.PROXY_URI + "slingshot/listViewTemplates?nodeRef=" + this.doclistMetadata.parent.nodeRef,
          successCallback: {
            fn: this.showCustomViewDlg,
            scope: this
          },
          failureMessage: Alfresco.util.message("view.errorListViewTemplates"),
          execScripts: true
        });
      }
    },

    /**
     * Show/Hide custom view button click handler
     *
     * @method onHideCustomView
     * @param e {object} DomEvent
     * @param p_obj {object} Object passed back from addListener method
     */
    onHideCustomView: function AtolDLTB_onHideCustomView(e, p_obj) {
      this.options.hideCustomView = !this.options.hideCustomView;
      this.services.preferences.set(PREF_HIDE_CUSTOMVIEW, this.options.hideCustomView);
      var customView = this.id.replace("toolbar", "customview") + "-customView" ;

      if (this.options.hideCustomView) {
        Dom.get(this.id + "-customView-button-hide").innerHTML = this.msg("menu.customView.show");
        Dom.removeClass(customView, "customView-button-show");
      } else {
        Dom.get(this.id + "-customView-button-hide").innerHTML = this.msg("menu.customView.hide");
        Dom.addClass(customView, "customView-button-show");
      }

      YAHOO.Bubbling.fire("doclistMetadata", {
        metadata: this.doclistMetadata
      });

      if (e) { Event.preventDefault(e); }
    }
    /*********************************************************************************************************************/
  });
})();