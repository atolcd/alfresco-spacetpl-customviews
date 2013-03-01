"Custom views and space templates" for Alfresco Share
================================

This extension allows you to add custom views and/or space templates mechanisms in the document library of sites and/or in the Repository View.  

Building the module
-------------------
Check out the project if you have not already done so 

        git clone git://github.com/atolcd/alfresco-spacetpl-customviews.git

An Ant build script is provided to build AMP files **OR** JAR files containing the custom files.  
Before building, ensure you have edited the `build.properties` file to set the path to your Alfresco SDK.  

To build AMP files, run the following command from the base project directory:

        ant dist-amp

If you want to build JAR files, run the following command:

        ant dist-jar


Installing the module
---------------------
This extension is a standard Alfresco Module, so experienced users can skip these steps and proceed as usual.

### 1st method: Installing AMPs (recommended)
1. Stop Alfresco
2. Use the Alfresco [Module Management Tool](http://wiki.alfresco.com/wiki/Module_Management_Tool) to install the modules in your Alfresco and Share WAR files:

        java -jar alfresco-mmt.jar install space-templates-custom-views-alfresco-vX.X.X.amp $TOMCAT_HOME/webapps/alfresco.war -force
        java -jar alfresco-mmt.jar install space-templates-custom-views-share-vX.X.X.amp $TOMCAT_HOME/webapps/share.war -force

3. Delete the `$TOMCAT_HOME/webapps/alfresco/` and `$TOMCAT_HOME/webapps/share/` folders.  
**Caution:** please ensure you do not have unsaved custom files in the webapp folders before deleting.
4. Start Alfresco


### 2nd method: Installing JARs
1. Stop Alfresco
2. Copy JAR files
    - Copy `space-templates-custom-views-X.X.X.jar` into the `/tomcat/shared/lib/` folder of your Alfresco.
    - Copy `space-templates-custom-views-X.X.X.jar` into the `/tomcat/webapps/alfresco/WEB-INF/lib/` folder of your Alfresco.
3. Start Alfresco


Using the module
---------------------
Go to the document library of a site or in the repository (from Share):
 - The "create folder" button into the toolbar has changed (drop down menu)
 - A new button "custom view" is available in the toolbar (right side)

### Default configuration

        <alfresco-config>
           <!-- Space templates configuration options -->
           <config evaluator="string-compare" condition="SpaceTemplates">
             <!--
                  The 'space-templates' config element value can be one of:
                  both        - space templates are availabled in the repository and in sites
                  repository  - space templates are only availabled in the repository
                  sites       - space templates are only availabled in sites
                  none        - space templates are not availabled
             -->
             <display-mode>
                <value>both</value>
             </display-mode>
           </config>

           <!-- Custom views configuration options -->
           <config evaluator="string-compare" condition="CustomViews">
             <!--
                  The 'custom-views' config element value can be one of:
                  both        - custom views are availabled in the repository and in sites
                  repository  - custom views are only availabled in the repository
                  sites       - custom views are only availabled in sites
                  none        - custom views are not availabled
             -->
             <display-mode>
                <value>both</value>
             </display-mode>

             <!-- CSS attributes -->
             <style>
                <attribute id="max-height">20em</attribute>
                <attribute id="overflow-y">auto</attribute>
             </style>
           </config>
        </alfresco-config>

### How override default configuration?
You have to create a XML file called `space.templates.custom.views-config-custom.xml` into `/shared/classes/alfresco/web-extension/` folder.  
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


### Module Deployment
This module uses latest Share 4.x extension mechanisms. You can deploy/undeploy the module directly from : `http://server:port/share/page/modules/deploy`  


LICENSE
---------------------
This extension is licensed under `GNU Library or "Lesser" General Public License (LGPL)`.  
Created by: [Bertrand FOREST] (https://github.com/bforest)  


Our company
---------------------
[Atol Conseils et Développements] (http://www.atolcd.com) is Alfresco [Gold Partner] (http://www.alfresco.com/partners/atol)  
Follow us on twitter [ @atolcd] (https://twitter.com/atolcd)  