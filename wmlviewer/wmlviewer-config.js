"use strict";

//*****INITIALIZE GLOBAL VARIABLES**********
var wmlviewer = {
	//***********CONFIGURE THESE VARIABLES AS NEEDED *****************
	
	//Relative path to folder containing 'images' folder so wml-chart-templates.js can find icons used for buttons
	wmlviewerPath:"wmlviewer/",
	//Path to proxy service to enable access to servers which do not allow Cross Domain Requests
	proxy:"esri-proxy/proxy.php",
	//Default Feature Service
	featureService:"http://crwr-arcgis10.austin.utexas.edu/ArcGIS/rest/services/WorldWaterOnline/WatershedExplorer_Discharge/MapServer",
	//Default chart title
	chartTitle:"WaterML Viewer",
	//ID of the HTML Div elements each object should render to
	mapDiv:"map",
	chartDiv:"chart",
	tableDiv:"table",
	//Number of significant figures to round chart values to (includes both left and right of decimal point)
	sigFigs:4,
	//Initial Map Extents e.g., {ymin:-59,ymax:72}, {xmin:-160,xmax:160,ymin:-59,ymax:72}
	initialExtent:{},

	//************THESE VARIABLES SHOULD BE LEFT AT INITIAL VALUES****************
		
	//Parsed URL object
	urlObj:null,
	mainMap:null,
	mainChart:null,
	curMap:null,
	curChart:null,
	//When parsing XML, some browsers require namespaces, others don't work with them. 
	//Note: attributes require namespaces (without escapce sequence \\) in all browsers tested
	includeNamespace:null,
	WaterMLVersion:null,
	featureSet:null,
	
};
