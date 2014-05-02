//This requires the following javascript to be included:
//http://js.arcgis.com/3.9compact/

//******GLOBAL VARIABLES*********
var curMap;
//******END GLOBAL VARIABLES************


//*******MAP WIDGET***************
//This object-oriented approach needs refinement. Currently does not behave properly if multiple versions of a map are instantiated in the same document.
function WMLMap() {
    var self = this;
    this.mapDiv = null;
    this.map = null;
    this.chartVariableName = null;
    this.basemaps = ["http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer", "http://hydrology.esri.com:6080/arcgis/rest/services/WorldHydroReferenceOverlay/MapServer"];
    this.featureServices = [];
    
    this.init = function(initialExtent) {
        curMap = self;
        CreateMap(self.mapDiv, self.basemaps, self.featureServices, initialExtent);
    }
    this.AddFeatureService = function(featureService) {
        curMap = self;
        self.featureServices.push(featureService);
    }
}
//*********END MAP WIDGET*********************

//**********MAP METHODS***********************
function CreateMap(div, basemapList, featureServiceList, initialExtent){
    require([
        "esri/map",
        "esri/layers/ArcGISTiledMapServiceLayer",
         "esri/geometry/Extent"
    ], function (Map, ArcGISTiledMapServiceLayer, Extent) { 
        // Define the default extent for the map
        var extent = new Extent({"spatialReference":{"wkid":4326}});
        // If client didn't provide a default, then cover the width, but not necessarily the height, of the full extent
        if (initialExtent === undefined || (
            initialExtent.xmin === undefined && initialExtent.ymin === undefined &&
            initialExtent.xmin === undefined && initialExtent.ymin === undefined)) {
                extent.xmin = -180;
                extent.xmax = 180;
        }
        else {
            if ('xmin' in initialExtent) {extent.xmin = initialExtent.xmin;}
            if ('ymin' in initialExtent) {extent.ymin = initialExtent.ymin;}
            if ('xmax' in initialExtent) {extent.xmax = initialExtent.xmax;}
            if ('ymax' in initialExtent) {extent.ymax = initialExtent.ymax;}
        }

        curMap.map = new Map(div,{extent: extent});
        for (var i=0;i<basemapList.length;i++){
            var basemap = new ArcGISTiledMapServiceLayer(basemapList[i]);
            curMap.map.addLayer(basemap);
        }
        for (var i=0;i<featureServiceList.length;i++){
            AddFeatureService(featureServiceList[i]);
        }		
    })
}
   
function AddFeatureService(featureService){
    //Takes a URL to a non cached map service.
    require([
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/layers/FeatureLayer",
        "esri/layers/ImageParameters"
    ], function (ArcGISDynamicMapServiceLayer, Query, QueryTask, FeatureLayer, ImageParameters) { 
        var imgParams = new ImageParameters();
        imgParams.format = "png32"; // Honors transparency set by map service
        var service = new ArcGISDynamicMapServiceLayer(featureService, {imageParameters: imgParams});
        curMap.map.addLayer(service);
            
        //Define click behavior		
        dojo.connect(curMap.map, "onClick", executeQueryTask);
        var layer = featureService + "/0";
        queryTask = new QueryTask(layer);
        query = new Query();
        query.outFields = ["SiteName", "WaterML", "Source"];		
    })	
}
//********END MAP METHODS********************

//********QUERY FUNCTIONS***********************
function executeQueryTask(evt) {
    var centerPoint = new esri.geometry.Point
            (evt.mapPoint.x,evt.mapPoint.y,evt.mapPoint.spatialReference);
    var querybox;
    querybox = pointToExtent(curMap.map,centerPoint, 10);
    query.geometry = querybox;

    //Execute task and call showResults on completion
    queryTask.execute(query, function(fset) {
        if (fset.features.length === 1) {
            showFeature(fset.features[0],evt);
            
        } else if (fset.features.length !== 0) {
            showFeatureSet(fset,evt);
        }
    }); 
}

function pointToExtent(/*esri.Map*/ map, /*esri.geometry.Point (in map coords)*/ point, /*Number*/ toleranceInPixel) {
    //create a bounding box around a point to use as a query extent
      
    //calculate map coords represented per pixel
    var pixelWidth = map.extent.getWidth() / map.width;
    
    //calculate map coords for tolerance in pixel
    var toleranceInMapCoords = toleranceInPixel * pixelWidth;
    //calculate & return computed extent
    var box;
    box = new esri.geometry.Extent(point.x - toleranceInMapCoords, point.y - toleranceInMapCoords, point.x + toleranceInMapCoords, point.y + toleranceInMapCoords, map.spatialReference);
    return box;
}	
//********END QUERY FUNCTIONS*************

//********DIALOGUE BOXES***************
function showFeature(feature,evt) {
    //When single feature is selected, provide user with metadata and option to add time series to chart
    //Note: this requires a separate js file defining AddWaterML
    dojo.require("dijit/form/Button");
    curMap.map.graphics.clear();

    //construct infowindow title and content
    var title = "";
    var content;
    
    var siteNameLabel = 'Site Name: ' + feature.attributes.SiteName + '</br>';
    var dataProviderLabel = 'Data Provider: ' + feature.attributes.Source + '</br>';
    var addToChartButtonLabel = '<button dojoType="dijit.form.Button" type="button" style="width:100%" onClick="javascript:' + curMap.chartVariableName + '.AddLink(' + "'" + feature.attributes.WaterML + "'" + ');CloseWindow();">Add to Chart</button></br>';
    var dataSourceButtonLabel = '<a href="' + feature.attributes.WaterML + '" target="_blank"><button style="width:50%">Data Source</button></a>';
    var closeButton = '<button dojoType="dijit.form.Button" type="button" style="width:50%" onClick="javascript:CloseWindow();">Close</button>'
    
    if (curMap.chartVariableName) {
        content =  siteNameLabel + dataProviderLabel + addToChartButtonLabel + dataSourceButtonLabel + closeButton;
    } else {
        content = siteNameLabel + dataProviderLabel + dataSourceButtonLabel + closeButton; 	
    }
    curMap.map.infoWindow.setTitle(title);
    curMap.map.infoWindow.setContent(content);

    (evt) ? curMap.map.infoWindow.show(evt.screenPoint,curMap.map.getInfoWindowAnchor(evt.screenPoint)) : null;
}

function showFeatureSet(fset,evt) {
    //When user click returns multiple nearby features, resolve to a single feature via dialogue box
    var screenPoint = evt.screenPoint;
    
    featureSet = fset;
    
    var numFeatures = featureSet.features.length;
    
    //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the infowindow.
    var title = "You have selected " + numFeatures + " fields.";
    var content = "Please select desired field from the list below.<br />";
    
    for (var i=0; i<numFeatures; i++) {
        var graphic = featureSet.features[i];
        content = content + graphic.attributes.SiteName + 
            " Field (<span class='wmlPopupLink' onclick='showFeature(featureSet.features[" + 
            i + "]);'>show</span>)<br/>";
    }
    curMap.map.infoWindow.setTitle(title);
    curMap.map.infoWindow.setContent(content);
    curMap.map.infoWindow.show(screenPoint,curMap.map.getInfoWindowAnchor(evt.screenPoint));
}

function CloseWindow(){
        curMap.map.infoWindow.hide();
}
//************END DIALOGE BOXES**************