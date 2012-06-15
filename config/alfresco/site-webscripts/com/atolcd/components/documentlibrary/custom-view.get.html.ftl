<script type="text/javascript">//<![CDATA[
  new Alfresco.CustomView("${args.htmlid}").setOptions(
    {
      customViewMaxHeight: "${style?js_string![]}"
    }
  );
//]]></script>

<div id="${args.htmlid}-customView" class="customView customView-hidden">
  <h3>${msg("customView.title")}</h3>
  <div id="${args.htmlid}-customViewContent" class="customViewContent">
  </div>
</div>