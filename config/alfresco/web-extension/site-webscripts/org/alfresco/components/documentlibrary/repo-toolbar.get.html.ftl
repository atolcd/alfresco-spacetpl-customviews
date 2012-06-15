<#include "include/toolbar.lib.ftl" />
<@toolbarTemplate>
<script type="text/javascript">//<![CDATA[
   new Alfresco.RepositoryDocListToolbar("${args.htmlid?js_string}").setOptions(
   {
      rootNode: "${rootNode!"null"}",
      hideNavBar: ${(preferences.hideNavBar!false)?string},
      googleDocsEnabled: ${(googleDocsEnabled!false)?string},
      repositoryBrowsing: ${(rootNode??)?string},
      useTitle: ${((args.useTitle!config.scoped["DocumentLibrary"]["use-title"].value)!"true")?js_string}

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