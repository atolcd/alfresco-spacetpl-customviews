<@markup id="atol-custom-views-and-space-templates-documentlist-css-dependencies" target="css" action="after" scope="global">
  <#-- CSS Dependencies -->
  <@link rel="stylesheet" type="text/css" href="${url.context}/res/components/documentlibrary/atol-toolbar.css" group="documentlibrary"/>
</@>

<@markup id="atol-custom-views-and-space-templates-documentlist-js-dependencies" target="js" action="after" scope="global">
  <#-- JavaScript Dependencies -->
  <@script type="text/javascript" src="${url.context}/res/components/documentlibrary/repo-toolbar.js" group="documentlibrary"/>

  <@script type="text/javascript" src="${url.context}/res/components/documentlibrary/atol-toolbar.js" group="documentlibrary"/>
  <@script type="text/javascript" src="${url.context}/res/components/documentlibrary/repo-atol-toolbar.js" group="documentlibrary"/>
</@markup>