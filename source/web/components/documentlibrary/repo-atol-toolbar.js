// Atol namespace
if (typeof Atol == undefined || !Atol) { var Atol = {}; }
(function()
{
  // Define constructor...
  Atol.RepositoryDocListToolbar = function AtolDLTB_constructor(htmlId) {
    Atol.RepositoryDocListToolbar.superclass.constructor.call(this, htmlId);
    return this;
  };

  YAHOO.extend(Atol.RepositoryDocListToolbar, Atol.DocListToolbar);

  YAHOO.lang.augmentObject(Atol.RepositoryDocListToolbar.prototype,
  {
   onFileUpload: Alfresco.RepositoryDocListToolbar.prototype.onFileUpload,
   onFileUploadComplete: Alfresco.RepositoryDocListToolbar.prototype.onFileUploadComplete,
   _generateRSSFeedUrl: Alfresco.RepositoryDocListToolbar.prototype._generateRSSFeedUrl
  }, true);
})();