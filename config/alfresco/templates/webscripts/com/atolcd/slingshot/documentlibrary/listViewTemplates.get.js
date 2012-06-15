var nodeRef = args.nodeRef;
if(nodeRef) {
  var node = search.findNode(nodeRef);
  if(node) {
    var template = node.properties["cm:template"];
    if(template){
      model.templateApplied = template.nodeRef.toString();
    }
  }
}

model.templates = [];
var nodes = search.luceneSearch('+TYPE:"cm:content" +PATH:"/app:company_home/app:dictionary/app:content_templates/*//."');
if (nodes && nodes.length > 0) {
  model.templates = nodes;
}