<@compress single_line=true>
<#escape x as jsonUtils.encodeJSONString(x)>
{
  "templates": [
    <#list templates?sort_by('name') as template>
      {
        "name": "${template.name}",
        "title": "${template.properties["cm:title"]!""}",
        "nodeRef": "${template.nodeRef}"
      }
      <#if template_has_next>,</#if>
    </#list>
  ],
  "templateApplied" : "${templateApplied!''}"
}
</#escape>
</@>