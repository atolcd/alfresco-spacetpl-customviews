var attributes = config.scoped["CustomViews"]["style"].childrenMap["attribute"];
var css = [];

var i, ii = attributes.size();
for (i=0 ; i<ii ; i++) {
  var cssProperty = attributes.get(i);

  css.push(
    {
       property: cssProperty.attributes["id"],
       value: cssProperty.value
    }
  );
}

model.style = jsonUtils.toJSONString(css);