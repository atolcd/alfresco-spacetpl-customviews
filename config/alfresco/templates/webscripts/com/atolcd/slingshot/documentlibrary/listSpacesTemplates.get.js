model.templates = [];
var nodes = search.luceneSearch('+TYPE:"cm:folder" +PATH:"/app:company_home/app:dictionary/app:space_templates/*"');
if (nodes && nodes.length > 0) {
  model.templates = nodes;
}