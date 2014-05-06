//*****DEFAULT CONFIG VALUES**********
//Relative path to folder containing 'images' folder so wml-chart-templates.js can find icons used for buttons
var wmlviewerPath = 'wmlviewer/';
//var wmlviewerPath = '/wmlviewer/';
//Path to proxy service to enable access to servers which do not allow Cross Domain Requests
var proxy = "esri-proxy/proxy.php";
//Initial Map Extents e.g., {ymin:-59,ymax:72}, {xmin:-160,xmax:160,ymin:-59,ymax:72}
var initialExtent = {}; 
//Default chart title
var chartTitle = "WaterML Viewer";
//Default Feature Service
var featureService = "http://crwr-arcgis10.austin.utexas.edu/ArcGIS/rest/services/WorldWaterOnline/WatershedExplorer_Discharge/MapServer";
//ID of the HTML Div elements each object should render to
var mapDiv = "map";
var chartDiv = "chart";
var tableDiv = "table";
