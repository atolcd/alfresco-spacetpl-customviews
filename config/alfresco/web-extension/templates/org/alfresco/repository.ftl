<#include "include/alfresco-template.ftl" />
<#include "include/documentlibrary.inc.ftl" />
<@templateHeader>
   <@documentLibraryJS />
   <script type="text/javascript">//<![CDATA[
      new Alfresco.widget.Resizer("Repository");
   //]]></script>
   <@script type="text/javascript" src="${url.context}/res/modules/documentlibrary/doclib-actions.js"></@script>
</@>

<@templateBody>
   <div id="alf-hd">
      <@region id="header" scope="global" />
      <@region id="title" scope="template" />
   </div>
   <div id="bd">
      <@region id="actions-common" scope="template" />
      <@region id="actions" scope="template" />
      <div class="yui-t1" id="alfresco-repository">
         <div id="yui-main">
            <div class="yui-b" id="alf-content">
               <@region id="toolbar" scope="template" />

               <#-- Atol : Custom views -->
               <@region id="customview" scope="template" protected=true />

               <@region id="documentlist" scope="template" />
            </div>
         </div>
         <div class="yui-b" id="alf-filters">
            <@region id="filter" scope="template" />
            <@region id="tree" scope="template" />
            <@region id="categories" scope="template" />
            <@region id="tags" scope="template" />
         </div>
      </div>

      <@region id="html-upload" scope="template" />
      <@region id="flash-upload" scope="template" />
      <@region id="file-upload" scope="template" />
      <@region id="dnd-upload" scope="template" />
   </div>
   <@region id="doclib-custom" scope="template"/>
</@>

<@templateFooter>
   <div id="alf-ft">
      <@region id="footer" scope="global" />
   </div>
</@>