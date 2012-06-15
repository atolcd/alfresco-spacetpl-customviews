<@compress single_line=true>
<#escape x as jsonUtils.encodeJSONString(x)>
{
  "status" : ${status.code!''},
  "message" : "${msg(status.message!'')}"
}
</#escape>
</@>