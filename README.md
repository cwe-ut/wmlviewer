WMLViewer
=========
About
-----
WMLViewer is a set of web tools for viewing WaterML services as maps, graphs, and tables. The core functunality is provided by a library of Javascript functions. Sample implementations using HTML and CSS are provided for reference.

WaterML is a standard exchange format for time series information.
There are two versions:

1. WaterML 1.0, developed by the Consortium of Universities for the Advancement of Hydrologic Science, Inc. (CUAHSI)
2. WaterML 2.0, developed by the Open Geospatial Consortium (OGC) and the World Meteorological Organization (WMO)
 
WaterML 1.0 is being phased out of use in preference for WaterML 2.0. However, as a number of data providers are still using WaterML 1.0, this library is designed to interpret both versions and give the user a seemless experience.

More information about WaterML, including the specification documents, can be found here: http://www.opengeospatial.org/standards/waterml

Suggested Improvements
----------------------
The following are a few of the high priority improvements suggested for this library:

1. General cleanup to align code with Javascript best practices
2. Ability to adjust server calls to a specified date range
3. Expand library of observed properties and units
4. As variations in WaterML services are identified, expand parsing functions accordingly
5. Identify additional desired features
6. Creation of API documentation


Demo
----
A demo of the current master branch can be viewed at: http://webapps.hydroinformatix.com/wmlviewer/github/wmlviewer.html


License
-------
This library includes Highcharts, which is free and distributable for non-commercial use but is not free for commercial or governmental use. More information can be found here: http://shop.highsoft.com/highcharts.html

This library includes the PHP portion of the Resource Proxy developed by ESRI, which is free and distributable with certain limitations. More information can be found here: https://github.com/Esri/resource-proxy








