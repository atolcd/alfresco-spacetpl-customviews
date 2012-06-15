(function()
{
  /**
  * YUI Library aliases
  */
  var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

  /**
   * Preferences
   */
  var PREFERENCES_ROOT = "org.alfresco.share.documentList",
      PREF_HIDE_CUSTOMVIEW = PREFERENCES_ROOT + ".hideCustomView";

  /**
  * Alfresco Slingshot aliases
  */
  var $siteURL = Alfresco.util.siteURL;

  /**
   * Object container for initialization options
   *
   * @property options
   * @type object
   */
  Alfresco.DocListToolbar.prototype.options.hideCustomView = false;
  Alfresco.DocListToolbar.prototype.options.customViewDisplayMode = 'both';


  /**
  * Fired by YUILoaderHelper when required component script files have
  * been loaded into the browser.
  *
  * @method onComponentsLoaded
  * @override
  */
  /*
  Alfresco.DocListToolbar.prototype.onComponentsLoaded = function Base_onComponentsLoaded() {
    if (this.onReadyCV && this.onReadyCV.call && this.id !== "null") {
      YUIEvent.onContentReady(this.id, this.onReadyCV, this, true);
    }

    Alfresco.DocListToolbar.superclass.onComponentsLoaded.call(this);
  };
  */


  /**
   * Fired by YUI when parent element is available for scripting.
   * Component initialisation, including instantiation of YUI widgets and event listener binding.
   *
   * @method onReadyCV
   */
  Alfresco.DocListToolbar.prototype.onReadyCV = function DLTB_onReadyCV()
  {
    if (
      this.options.customViewDisplayMode != 'none' && (
        (this.options.customViewDisplayMode == 'both') ||
        (this.options.customViewDisplayMode == 'repository' && !this.options.siteId) ||
        (this.options.customViewDisplayMode == 'sites' && this.options.siteId)
      )
    ) {
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
        '</div>' +
        '<div class="separator">&nbsp;</div>';

      // Create custom action element
      var div = document.createElement('div');
      div.setAttribute("class", "custom-view-menu hideable toolbar-hidden DocListTree");
      div.innerHTML = customViewAction;

      // Insert custom action element into the DOM
      var right = YAHOO.util.Selector.query('div .right', this.id + '-body', true);
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
      YAHOO.util.Dom.get(this.id + "-customView-button-hide").innerHTML = buttonHideMsg;
      if (!this.options.hideCustomView){
        YAHOO.util.Dom.addClass(this.id.replace("toolbar","customview") + "-customView", "customView-button-show");
      }
    }
  };


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
  Alfresco.DocListToolbar.prototype.onDoclistMetadata = function DLTB_onDoclistMetadata(layer, args)
  {
     var obj = args[1];
     this.folderDetailsUrl = null;
     if (obj && obj.metadata)
     {
        this.doclistMetadata = Alfresco.util.deepCopy(obj.metadata);
        if (obj.metadata.parent && obj.metadata.parent.nodeRef)
        {
           this.folderDetailsUrl = $siteURL("folder-details?nodeRef=" + obj.metadata.parent.nodeRef);
        }

        /************************ Custom Views ****************************/
        var items = YAHOO.util.Dom.getElementsByClassName("onCustomView", "span", this.id + "-customView-menu");
        if(items.length == 1){
          var item = items[0];
          if(this.doclistMetadata.parent.permissions.user.Write){
            YAHOO.util.Dom.removeClass(item,"custom-view-item-disabled");
          } else {
            YAHOO.util.Dom.addClass(item,"custom-view-item-disabled");
          }
        }
        /******************************************************************/
     }
  };


  /**
   * Selected Items button click handler
   *
   * @method onCreateMenu
   * @param sType {string} Event type, e.g. "click"
   * @param aArgs {array} Arguments array, [0] = DomEvent, [1] = EventTarget
   * @param p_obj {object} Object passed back from subscribe method
   */
  Alfresco.DocListToolbar.prototype.onCreateMenu = function DLTB_onCreateMenu(sType, aArgs, p_obj)
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
   * Create and load custom view dialog
   *
   * @method showCustomViewDlg
   * @param e {object} DomEvent
   * @param response {object} Object passed back from successCallback method
   */
  Alfresco.DocListToolbar.prototype.showCustomViewDlg = function DLTB_showCustomViewDlg(response)
  {
    // Download Simple Dialog
    var customViewDlg = new YAHOO.widget.SimpleDialog('custom-view-dialog', {
      width: "500px",
      modal:true,
      fixedcenter: true,
      draggable: false,
      constraintoviewport: true
    });

    customViewDlg.setHeader(Alfresco.util.message("view.header"));

    var templates = response.json.templates;
    var templateApplied = response.json.templateApplied;

    // Create dialog div element
    var html = '<div class="viewTemplate-container">';
    html += '<label for="' + this.id + '-view-template-name">' + Alfresco.util.message("view.template-name") + '</label>';
    html += '<select id="' + this.id + '-view-template-name" name="view-template-name">';
    html += '<option value="">' + Alfresco.util.message("view.deleteView") + '</option>';
    for(var t in templates) {
      var templateRef = templates[t].nodeRef ;
      if(templateRef != templateApplied) {
        html += '<option value="' + templateRef + '">' + templates[t].name + '</option>';
      } else {
        html += '<option value="' + templateRef + '" selected="selected">' + templates[t].name + '</option>';
      }
    }
    html += '<select/>';
    html += '</div>';

    // Add DOM elements into dialog body
    customViewDlg.setBody(html);

    var me = this;

    // Add buttons : cancel and create
    buttons = [
      {
        text: Alfresco.util.message("view.cancel"),
        handler: function(){ this.destroy(); }
      },
      {
        text: Alfresco.util.message("view.custom"),
        handler: function() {
          var selectViewTemplate = YAHOO.util.Dom.get(me.id + "-view-template-name");
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
      }
    ];
    customViewDlg.cfg.queueProperty("buttons", buttons);

    // Dialog render
    customViewDlg.render(document.body);
  };


  /**
   * Custom view button click handler
   *
   * @method onCustomView
   * @param e {object} DomEvent
   * @param p_obj {object} Object passed back from addListener method
   */
  Alfresco.DocListToolbar.prototype.onCustomView = function DLTB_onCustomView(e, p_obj)
  {
    if(this.doclistMetadata.parent.permissions.user.Write){
      Alfresco.util.Ajax.request({
        url: Alfresco.constants.PROXY_URI + "slingshot/listViewTemplates?nodeRef=" + this.doclistMetadata.parent.nodeRef,
        successCallback:
        {
          fn: this.showCustomViewDlg,
          scope: this
        },
        failureMessage: Alfresco.util.message("view.errorListViewTemplates"),
        execScripts: true
      });
    }
  };


  /**
   * Show/Hide custom view button click handler
   *
   * @method onHideCustomView
   * @param e {object} DomEvent
   * @param p_obj {object} Object passed back from addListener method
   */
  Alfresco.DocListToolbar.prototype.onHideCustomView = function DLTB_onHideCustomView(e, p_obj)
  {
    this.options.hideCustomView = !this.options.hideCustomView;
    this.services.preferences.set(PREF_HIDE_CUSTOMVIEW, this.options.hideCustomView);
    var customView = this.id.replace("toolbar", "customview") + "-customView" ;

    if(this.options.hideCustomView){
      YAHOO.util.Dom.get(this.id + "-customView-button-hide").innerHTML = this.msg("menu.customView.show");
      YAHOO.util.Dom.removeClass(customView, "customView-button-show");
      YAHOO.util.Dom.addClass(customView, "customView-hidden");
    } else {
      YAHOO.util.Dom.get(this.id + "-customView-button-hide").innerHTML = this.msg("menu.customView.hide");
      YAHOO.util.Dom.addClass(customView, "customView-button-show");
      YAHOO.Bubbling.fire("doclistMetadata",
      {
        metadata: this.doclistMetadata
      });
    }
    Event.preventDefault(e);
  };
})();