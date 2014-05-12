const PREFERENCES_ROOT = "com.atolcd.share.documentList";

function getConfigValue(scoped, prop) {
  var value = "both",
      cfg = config.scoped[scoped];

  if (cfg != null) {
    var tmp = cfg[prop];
    if (tmp != null) {
      value = tmp.getChildValue('value') || "both";
    }
  }
  return value;
}

function setAtolToolbarOptions(widgetName, newWidgetName) {
  var doclistPrefs = eval('try{(prefs.' + PREFERENCES_ROOT + ')}catch(e){}');
  if (typeof doclistPrefs != "object") {
    doclistPrefs = {};
  }

  var attributes = config.scoped["CustomViews"]["style"].childrenMap["attribute"],
      css = [];

  if (attributes) {
    for (var i=0, ii = attributes.size() ; i<ii ; i++) {
      var cssProperty = attributes.get(i);
      css.push(
        {
          property: cssProperty.attributes["id"],
          value: cssProperty.value
        }
      );
    }
  }

  for (var i=0; i<model.widgets.length; i++) {
    if (model.widgets[i].name == widgetName) {
      model.widgets[i].name = newWidgetName;
      model.widgets[i].options.hideCustomView = Boolean(doclistPrefs.hideCustomView);
      model.widgets[i].options.customViewDisplayMode = getConfigValue("CustomViews", "display-mode");
      model.widgets[i].options.spaceTemplatesDisplayMode = getConfigValue("SpaceTemplates", "display-mode");
      model.widgets[i].options.customViewCSS = jsonUtils.toJSONString(css);
    }
  }
}