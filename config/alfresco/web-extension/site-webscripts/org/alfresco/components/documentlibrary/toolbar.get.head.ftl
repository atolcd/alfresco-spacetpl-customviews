<#include "../component.head.inc">
<!-- Document Library Toolbar -->
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/components/documentlibrary/toolbar.css" />
<@script type="text/javascript" src="${page.url.context}/res/components/documentlibrary/toolbar.js"></@script>

<!-- Space templates -->
<@script type="text/javascript" src="${page.url.context}/res/components/documentlibrary/space-templates-toolbar.js"></@script>
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/components/documentlibrary/space-templates-toolbar.css" />

<!-- Custom views -->
<@script type="text/javascript" src="${page.url.context}/res/components/documentlibrary/custom-view-toolbar.js"></@script>
<@link rel="stylesheet" type="text/css" href="${page.url.context}/res/components/documentlibrary/custom-view-toolbar.css" />

<script type="text/javascript">
  /**
  * Fired by YUILoaderHelper when required component script files have
  * been loaded into the browser.
  *
  * @method onComponentsLoaded
  * @override
  */
  Alfresco.DocListToolbar.prototype.onComponentsLoaded = function Base_onComponentsLoaded() {
    if (this.onReadyST && this.onReadyST.call && this.id !== "null") {
      YUIEvent.onContentReady(this.id, this.onReadyST, this, true);
    }

    if (this.onReadyCV && this.onReadyCV.call && this.id !== "null") {
      YUIEvent.onContentReady(this.id, this.onReadyCV, this, true);
    }

    Alfresco.DocListToolbar.superclass.onComponentsLoaded.call(this);
  };
</script>