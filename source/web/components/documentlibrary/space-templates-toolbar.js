(function()
{
  /**
  * YUI Library aliases
  */
  var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

  /**
   * Object container for initialization options
   *
   * @property options
   * @type object
   */
  Alfresco.DocListToolbar.prototype.options.spaceTemplatesDisplayMode = 'both';


  /**
  * Fired by YUILoaderHelper when required component script files have
  * been loaded into the browser.
  *
  * @method onComponentsLoaded
  * @override
  */
  /*
  Alfresco.DocListToolbar.prototype.onComponentsLoaded = function Base_onComponentsLoaded() {
    if (this.onReadyST && this.onReadyST.call && this.id !== "null") {
      YUIEvent.onContentReady(this.id, this.onReadyST, this, true);
    }

    Alfresco.DocListToolbar.superclass.onComponentsLoaded.call(this);
  };
  */


  /**
   * Fired by YUI when parent element is available for scripting.
   * Component initialisation, including instantiation of YUI widgets and event listener binding.
   *
   * @method onReadyST
   */
  Alfresco.DocListToolbar.prototype.onReadyST = function DLTB_onReadyST()
  {
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
      var left = YAHOO.util.Selector.query('div .left', this.id + '-body', true);
      var createFolderElt = YAHOO.util.Selector.query('div .new-folder', this.id + '-body', true);

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
  };

  /**
   * Selected Items button click handler
   *
   * @method onCreateSpace
   * @param sType {string} Event type, e.g. "click"
   * @param aArgs {array} Arguments array, [0] = DomEvent, [1] = EventTarget
   * @param p_obj {object} Object passed back from subscribe method
   */

  Alfresco.DocListToolbar.prototype.onCreateSpace = function DLTB_onCreateSpace(sType, aArgs, p_obj)
  {
     var domEvent = aArgs[0],
        eventTarget = aArgs[1];

     // Get the function related to the clicked item
     var fn = Alfresco.util.findEventClass(eventTarget);
     if (fn && (typeof this[fn] == "function"))
     {
        this[fn].call(this);
     }
     Event.preventDefault(domEvent);
  };


  /**
   * New space button click handler
   *
   * @method onNewSpaceFromTemplate
   * @param e {object} DomEvent
   * @param p_obj {object} Object passed back from addListener method
   */

  Alfresco.DocListToolbar.prototype.onNewSpaceFromTemplate = function DLTB_onNewSpaceFromTemplate(e, p_obj)
  {
    var createDlg = function(listTemplate, folder) {
      // Simple Dialog
      var createSpaceDlg = new YAHOO.widget.SimpleDialog('create-space-dialog', {
        width: "500px",
        modal:true,
        fixedcenter: true,
        draggable: false,
        constraintoviewport: true
      });

      createSpaceDlg.setHeader(Alfresco.util.message("space.header"));

      // Create dialog div element
      var html = '<div class="spaceTemplate-container">';
      html += '<label for="space-name">' + Alfresco.util.message("space.name") + '</label>';
      html += '<input id="space-name" type="text" name="space-name" />';
      html += '</div>';

      html += '<div class="spaceTemplate-container">';
      html += '<label for="space-template-name">' + Alfresco.util.message("space.template-name") + '</label>';
      html += '<select id="space-template-name" name="space-template-name">';
      html += listTemplate;
      html += '<select/>';
      html += '</div>';

      // Add DOM elements into dialog body
      createSpaceDlg.setBody(html);

      // Add buttons : cancel and create
      buttons = [
        {
          text: Alfresco.util.message("space.create"),
          handler: function() {
            var spaceName = YAHOO.util.Dom.get("space-name").value;
            var spaceTemplateNodeRef = YAHOO.util.Dom.get("space-template-name").value;

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
    var me = this;
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
  };
})();