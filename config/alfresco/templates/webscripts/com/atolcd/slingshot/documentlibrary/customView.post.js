var folderNodeRef = args.folderNodeRef;

try {
  if(folderNodeRef) {
    var folderNode = search.findNode(folderNodeRef);
    if(folderNode) {
      var viewTemplateNodeRef = args.viewTemplateNodeRef;
      if(viewTemplateNodeRef) {
        var viewTemplateNode = search.findNode(viewTemplateNodeRef);
        if(viewTemplateNode) {
          if (!folderNode.hasAspect("cm:templatable")){
            folderNode.addAspect("cm:templatable");
          }
          folderNode.properties["cm:template"] = viewTemplateNodeRef ;
          folderNode.save();
        } else {
          status.code = 404;
          status.message = "error.nodeViewTemplateNotFound";
        }
      } else {
        folderNode.removeAspect("cm:templatable");
        folderNode.save();
      }
    } else {
      status.code = 404;
      status.message = "error.nodeFolderNotFound";
    }
  } else {
    status.code = 404;
    status.message = "error.missingParams";
  }
} catch(e){
  status.code = 500;
  status.message = "error.error";
}