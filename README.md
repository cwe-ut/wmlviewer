WMLViewer
=========

Demo
----
A demo of the current master branch can be viewed at: http://webapps.hydroinformatix.com/wmlviewer/github/wmlviewer.html

A sample list of map services which can be used to test WMLViewer. To view these, add "?featureService=" + Service URL to the WMLViewer URL. (e.g. http://webapps.hydroinformatix.com/wmlviewer/github/wmlviewer.html?featureService=http://crwr-arcgis-p01.austin.utexas.edu/arcgis/rest/services/WorldWaterOnline/WWO_SoilMoisture_GLDAS/MapServer )

Streamflow: ?featureService=http://crwr-arcgis-p01.austin.utexas.edu/arcgis/rest/services/WorldWaterOnline/WWO_Streamflow/MapServer

Precipitation: ?featureService=http://crwr-arcgis-p01.austin.utexas.edu/arcgis/rest/services/WorldWaterOnline/WWO_Precipitation_NLDAS/MapServer

Evaporation: ?featureService=http://crwr-arcgis-p01.austin.utexas.edu/arcgis/rest/services/WorldWaterOnline/WWO_Evaporation_NLDAS/MapServer

Soil Moisture: ?featureService=http://crwr-arcgis-p01.austin.utexas.edu/arcgis/rest/services/WorldWaterOnline/WWO_SoilMoisture_GLDAS/MapServer

Reservoir Storage: ?featureService=http://crwr-arcgis-p01.austin.utexas.edu/arcgis/rest/services/WorldWaterOnline/WWO_ReservoirStorage/MapServer

Water Level: ?featureService=http://crwr-arcgis-p01.austin.utexas.edu/arcgis/rest/services/WorldWaterOnline/WWO_WaterLevel/MapServer

About WMLViewer
---------------
WMLViewer is a set of web tools for viewing WaterML services as maps, graphs, and tables. The primary focus is to combine interactive maps with interactive charts in a web browser setting, allowing a user to explore and download data in an easy-to-use fashion.

The core functunality is provided by a Javascript library. Sample implementations using HTML and CSS are provided to aid web developers in creating custom implementations. 

WMLViewer has been developed to read an ESRI Map Service or OGC Web Feature Service (WFS) which contains a collection of time series metadata for time series located at discrete points in space. Included in the metadata is a "WaterML" field which contains a REST endpoint to the time series of interest at that point.

About WaterML
-------------
WaterML is a standard exchange format for time series information.
There are two versions:

1. WaterML 1.0, developed by the Consortium of Universities for the Advancement of Hydrologic Science, Inc. (CUAHSI)
2. WaterML 2.0, developed by the Open Geospatial Consortium (OGC) and the World Meteorological Organization (WMO)

This library is designed to interpret both versions and give the user a seamless data visualization experience. More information about WaterML, including the specification documents, can be found here: http://www.opengeospatial.org/standards/waterml 

Note: Many web services can produce the WaterML 2.0 standard but data providers are encouraged to use the WaterML profile within the OGC Sensor Observation Service (SOS) as the vehicle for delivering the WaterML data service.

Suggested Improvements
----------------------
The following are a few of the high priority improvements suggested for this library:

1. General cleanup to align code with Javascript best practices
2. Add ability to adjust server calls to a specified date range
3. Allow multiple feature services to be added to the map and queried
4. Expand library of observed properties and units
5. Add user interface for changing units on specific axes
6. As variations in WaterML services are identified, expand parsing functions accordingly
7. Identify additional desired features
8. Create compressed version of Javascript code for better performance
9. Create API documentation

License
-------
This library includes Highcharts, which is free and distributable for non-commercial use but is not free for commercial or governmental use. More information can be found here: http://shop.highsoft.com/highcharts.html

This library includes the PHP portion of the Resource Proxy developed by ESRI, which is free and distributable with certain limitations. More information can be found here: https://github.com/Esri/resource-proxy

Proxy Setup
-----------
Some servers do not allow cross domain requests, which causes the XMLHttpRequest to fail. A proxy can be used which echos the contents of the request to a local php page, which can then be accessed via XMLHttpRequest. A proxy is included in WMLViewer which should work automatically as long as the proxy.config file contains the desired services (see Step 5 below). A list of known WaterML servers is included in proxy.config by default. The following steps can be followed for troubleshooting or additional customization:

1. Copy the folder esri-proxy to the desired location
2. Confirm that the proxy is forwarding requests directly in the browser using http://[yourmachine]/esri-proxy/proxy.php?http://services.arcgisonline.com/ArcGIS/rest/services/?f=pjson
3. Edit the proxy.config file in a text editor to set up your proxy configuration settings. Any desired WaterML services that do not allow cross domain requests need to be added to proxy.config. This is a security measure which restricts the sites echoed by the proxy to a specified list.
5. Verify that the proxy.config file is not accessible via the Internet and that the PHP server is configured correctly. To verify the proxy setup, open http://[yourmachine]/esri-proxy/proxy-verification.php in a web browser and follow the instructions.
6. Update the location of 'var proxy' in wml-chart.js to point to the location of proxy.php

For more information, see https://github.com/Esri/resource-proxy/tree/master/PHP








