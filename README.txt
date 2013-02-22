###################################################
####### How override default configuration? #######
###################################################

Created file "space.templates.custom.views-config-custom.xml" into "/shared/classes/alfresco/web-extension/" folder.

Example:
<alfresco-config>

   <config evaluator="string-compare" condition="SpaceTemplates" replace="true">
     <!-- Space templates configuration option -->
     <!--
          The 'space-templates' config element value can be one of:
          both        - space templates are availabled in the repository and in sites
          repository  - space templates are only availabled in the repository
          sites       - space templates are only availabled in sites
          none        - space templates are not availabled
     -->
     <display-mode>
        <value>none</value>
     </display-mode>
   </config>
   <config evaluator="string-compare" condition="CustomViews" replace="true">
       <!-- Custom views configuration option -->
       <!--
            The 'custom-views' config element value can be one of:
            both        - custom views are availabled in the repository and in sites
            repository  - custom views are only availabled in the repository
            sites       - custom views are only availabled in sites
            none        - custom views are not availabled
       -->
       <display-mode>
          <value>repository</value>
       </display-mode>
       
       <style>
          <attribute id="max-height">20em</attribute>
          <attribute id="overflow-y">auto</attribute>
          <attribute id="color">#333333</attribute>
       </style>
   </config>

</alfresco-config>


###################################################
################ Module Deployment ################
###################################################

  http://server:port/share/page/modules/deploy