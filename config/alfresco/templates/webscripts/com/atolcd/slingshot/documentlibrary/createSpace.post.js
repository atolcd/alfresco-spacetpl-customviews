var spaceTemplateNodeRef = args.spaceTemplateNodeRef;
var folderNodeRef = args.folderNodeRef;
var spaceName = args.spaceName;

try {
  if(spaceTemplateNodeRef && folderNodeRef && spaceName) {
    var spaceTemplateNode = search.findNode(spaceTemplateNodeRef);
    if(spaceTemplateNode) {
      var folderNode = search.findNode(folderNodeRef);
      if(folderNode) {
        if(!folderNode.childByNamePath(spaceName)) {
          var newSpace = spaceTemplateNode.copy(folderNode,true);
          newSpace.name = spaceName;
          newSpace.save();
        } else {
          status.code = 404;
          status.message = "error.nameAlreadyExists";
        }
      } else {
        status.code = 404;
        status.message = "error.nodeFolderNotFound";
      }
    } else {
      status.code = 404;
      status.message = "error.nodeSpaceTemplateNotFound";
    }
  } else {
    status.code = 404;
    status.message = "error.missingParams";
  }
} catch(e){
  status.code = 500;
  status.message = "error.error";
}