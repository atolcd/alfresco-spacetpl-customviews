<@markup id="css" >
  <#-- CSS Dependencies -->
  <@link rel="stylesheet" type="text/css" href="${url.context}/res/components/documentlibrary/custom-view.css" group="documentlibrary"/>
</@>

<@markup id="widgets">
  <@createWidgets group="documentlibrary"/>
</@>

<@uniqueIdDiv>
  <@markup id="html">
    <#assign el = args.htmlid?html?replace("_customview", "_default") />
    <div id="${el}-customView" class="customView customView-hidden">
      <h3>${msg("customView.title")}</h3>
      <div id="${el}-customViewContent" class="customViewContent"></div>
    </div>
  </@>
</@>