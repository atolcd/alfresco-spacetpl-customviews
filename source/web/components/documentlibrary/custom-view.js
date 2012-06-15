/**
 * CustomView component.
 *
 * @namespace Alfresco
 * @class Alfresco.CustomView
 */
(function () {
  var Dom = YAHOO.util.Dom;

  Alfresco.DocListToolbar.prototype.options.customViewMaxHeight = '[]';

  /**
   * CustomView CustomView.
   *
   * @param {String} htmlId The HTML id of the parent element
   * @return {Alfresco.CustomView} The new CustomView instance
   * @constructor
   */
  Alfresco.CustomView = function (htmlId) {
    Alfresco.CustomView.superclass.constructor.call(this, "Alfresco.CustomView", htmlId);
    var id = htmlId;
    YAHOO.Bubbling.on("doclistMetadata", this.onDoclistMetadata, this);
    return this;
  };

  YAHOO.extend(Alfresco.CustomView, Alfresco.component.Base);

  YAHOO.lang.augmentObject(Alfresco.CustomView.prototype, {
    onDoclistMetadata: function CustomView_onDoclistMetadata(layer, args)
    {
      var cssProperties = YAHOO.lang.JSON.parse(this.options.customViewMaxHeight);
      for (var i=0, ii=cssProperties.length ; i<ii ; i++) {
        // Set style
        var css = cssProperties[i];
        Dom.setStyle(this.id + "-customViewContent", css.property, css.value);
      }

      var obj = args[1];
      if(obj) {
        if(obj.metadata.parent.nodeRef) {
          if (Dom.hasClass(this.id + "-customView", "customView-button-show")) {
            Alfresco.util.Ajax.request({
              url: Alfresco.constants.PROXY_URI + "slingshot/processTemplate?nodeRef=" + obj.metadata.parent.nodeRef,
              successCallback: {
                fn: function (response) {
                  var template = response.serverResponse.responseText ;
                  if(template != ""){
                    Dom.get(this.id + "-customViewContent").innerHTML = template;
                    Dom.removeClass(this.id + "-customView", "customView-hidden");
                  } else { //No template
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
        }else {
          Dom.addClass(this.id + "-customView", "customView-hidden");
        }
      }
    }
  });
})();