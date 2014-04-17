// JavaScript Document
<!--Charting Scripts-->
//This requires the following javascript to be included in the header:
//jquery (tested on jquery.1.9.1.min.js), highcharts/highcharts.js, highcharts/modules/exporting.js, highcharts/modules/export-csv.js, wml-chart-templates.js and wml-property-library.js

//jquery is used for XML navigation as the .getElementsByTagName method had issues with cross browser compatability

//****GLOBAL VARIABLES****

//Some WaterML servers don't allow Cross Domain Requests, so a proxy must be used.
var proxy = "esri-proxy/proxy.php";
var curChart;

//Some browsers require namespaces, others don't work with them. 
//Note: attributes require namespaces (without escapce sequence \\) in all browsers tested
var includeNamespace = null;
var WaterMLVersion;
//******END GLOBAL VARIABLES******

//****CHART WIDGET****
function WMLChart() {
	var self = this;
	this.chartDiv = null;
	this.tableDiv = null;
	this.title = null;
	this.highchartOptions = wwoTemplate;
	this.chart = null;
	this.WMLTable = null;
	
	this.init = function() {
		//Initialize Chart
		curChart = self;
		curChart.highchartOptions.chart.renderTo = curChart.chartDiv;
		curChart.highchartOptions.title.text = curChart.title;
		curChart.chart = new Highcharts.Chart(curChart.highchartOptions);		
		
		//Initialize Table
		if (curChart.tableDiv){
			curChart.WMLTable = new WMLTable();
			curChart.WMLTable.tableDiv = curChart.tableDiv;
			curChart.WMLTable.init()
		}		
	}
	
	this.AddLink = function(wmlLink, linkSettings) {
		curChart = self;
		AddWaterML(wmlLink,linkSettings);
	}
	
	this.RemoveHiddenSeries = function() {
		curChart = self;
		RemoveHiddenSeries();
	}
	this.RemoveAllSeries = function() {
		curChart = self;
		RemoveAllSeries();
	}
}
//*********END CHART WIDGET*************

//*********TABLE WIDGET*****************
//Created automatically by the Chart Widget
function WMLTable() {
	var self = this;
	this.tableDiv = null;
	this.id = "wmlTable";
	this.headings = ["Site Name", "Property", "Data Source"];
	this.table = null;

	this.init = function() {
		self.table = document.createElement('table');
		$('#' + self.tableDiv).append(self.table);
		
		var header = self.table.createTHead();
		var row = header.insertRow();
		for (var i=0; i<self.headings.length; i++){
			AddTableElement(row, "th", self.headings[i]);
		}
		self.table.appendChild(document.createElement('tbody'));
	}
}
//**********END TABLE WIDGET*****************

//****CHART METHODS****
function AddWaterML(xmlLink, linkSettings) {
	//Given a link to a WML1 or WML2 server, parse XML and add to chart
	//linkSettings are optional
	
	//Default linkOptions
	var defaults = {
		startDate: null,
		endDate: null,
		previousPeriod: null,
		previousUnits: "days",
	};
	linkSettings = $.extend(true,{}, defaults, linkSettings);
	
	//Adjust period prior to server request
	var xmlLinkAdj =  xmlLink;
	if (linkSettings.previousPeriod) {
		AdjustPeriod(xmlLinkAdj, linkSettings.previousPeriod, linkSettings.previousUnits);
	} else {
		if (linkSettings.startDate) {
			AdjustStartDate(xmlLinkAdj, linkSettings.startDate);
		}
		if (linkSettings.endDate) {
			AdjustEndDate(xmlLinkAdj, linkSettings.endDate);
		}
	} 

	//Send link to server and get XML document
	var xmlDoc = loadXMLDoc(xmlLinkAdj);
	if (xmlDoc == -1) {
		return -1;
	}
	
	//Convert to format useful for jQuery
	xml = $(xmlDoc); 
	
	//Identify WML version and includeNamespace value 
	GetWMLVersion(xml); //currently defined as global variables. may want to restrict the scope
	
	if (WaterMLVersion < 1) {
		alert("Error adding series: WaterML Version not recognized");
		return null		
	} else {
		//Extract data from xml and add to chart
		var observations = GetObservations(xml); //WaterML2 allows for multiple time series observations per file, though typically there will be only one.
		for (var i=0;i<observations.length;i++) {
			//Get series metadata
			seriesName = GetSiteName(observations[i]);
			observedProperty = GetObservedProperty(observations[i]);
			sourceUnits = GetUnits(observations[i]);
			propertyDefaults = GetPropertyDefaults(observedProperty, sourceUnits, observations[i]);
			//Get series values
			seriesValues = GetValues(observations[i]);
			//Add series to chart and table
			AddSeries(seriesValues,seriesName,propertyDefaults, xmlLinkAdj);
		}
	}
}
function RemoveHiddenSeries(){
	//Remove all hidden series
	//Start from the highest index so the subsequent indices don't change
	var curSeries = curChart.chart.series.length - 1;
		
	while (curSeries > -1){
		if (curChart.chart.series[curSeries].visible == false) {
			curChart.chart.series[curSeries].remove(false);
			curChart.highchartOptions.series.splice(curSeries, 1);
			if (curChart.WMLTable) {
				curChart.WMLTable.table.deleteRow(curSeries+1);
			}
		} 
		curSeries = curSeries - 1;
	}
	curChart.chart.redraw();	
}
function RemoveAllSeries(){
	var curSeries = curChart.chart.series.length - 1;
		
	while (curSeries > -1){
		curChart.chart.series[curSeries].remove(false);
		curChart.highchartOptions.series.splice(curSeries, 1);
		if (curChart.WMLTable) {
			curChart.WMLTable.table.deleteRow(curSeries+1);
		}
		 
		curSeries = curSeries - 1;
	}
	curChart.chart.redraw();		
}
//****END CHART METHODS****


//***MODIFY URL REQUEST***
function AdjustPeriod (url, period, units){
	//Function Stub
	//Changes the given url to request the previous period units worth of data (i.e. 'past 7 days')
	var urlAdj = url;
	return urlAdj;
}
function AdjustStartDate (url, date) {
	//Function Stub
	//Changes the given url to request starting at a specified date
	var urlAdj = url;
	return urlAdj;
}
function AdjustEndDate (url, date) {
	//Changes the given url to request ending at a specified date	
	var urlAdj = url;
	return urlAdj;
}
//***END MODIFY URL REQUEST***

function AddSeries(values, seriesName, propertyDefaults, url){
	//Function Stub
	//Set appropriate series chart options and add series to chart
	var seriesType;
	var seriesColor;
	var fullLabel = propertyDefaults.propertyLabel + " (" + propertyDefaults.displayUnits + ")";
	var axis = FindAxis(fullLabel);	

	//Initialize series options
	
	if (propertyDefaults.propertyLabel == "Precipitation") {
		seriesType = 'column';
	} else {
		seriesType = 'area';
	}

	seriesColor = getNextColor();
	
	var seriesOptions = {
		name: seriesName,
		type: seriesType,
		color: seriesColor,
		yAxis: axis,
		fillColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
			stops: [
				[0, seriesColor],
				[1, Highcharts.Color(seriesColor).setOpacity(0).get('rgba')]
			]},
		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>' + fullLabel +  '<br/>',
		},
		data: values,
	}

	//Add series to options
	curChart.highchartOptions.series.push(seriesOptions);
		
	//redraw chart
	curChart.chart = new Highcharts.Chart(curChart.highchartOptions)
			
	//update table
	if (curChart.WMLTable) {
		var tableBody = curChart.WMLTable.table.getElementsByTagName('tbody')[0];
		var row = tableBody.insertRow(tableBody.rows.length);

		var rowValues = [seriesName, curChart.highchartOptions.yAxis[seriesOptions.yAxis].title.text, '<a href="' + url + '" target="_blank">WaterML</a>'];
		for (var i=0; i<rowValues.length;i++){
			AddTableElement(row, 'td', rowValues[i]);
		}
	}	
}

//***PARSE XML***
function GetObservations(xml) {
	var query;
	if(WaterMLVersion == 1){
		query = includeNamespace ? "ns1\\:timeSeries" : "timeSeries";
	} else {
		query = includeNamespace ? "wml2\\:observationMember" : "observationMember";
	}
	return xml.find(query);	
}
function GetSiteName(observation){
	var query;
	var result = null;
	if(WaterMLVersion == 1){
		query = includeNamespace ? "ns1\\:siteName" : "siteName";
		result=$($(observation).find(query)[0]).text();
	} else {
		query = includeNamespace ? "om\\:featureOfInterest" : "featureOfInterest";
		result=$($(observation).find(query)[0]).attr("xlink:title");
	}	
	return result;
}
function GetObservedProperty(observation) {
	var query;
	var result = null;
	if(WaterMLVersion == 1) {
		query = includeNamespace ? "ns1\\:variableName" : "variableName";
		result=$($(observation).find(query)[0]).text();
	} else {
		query = includeNamespace ? "om\\:observedProperty" : "observedProperty";
		result = $($(observation).find(query)[0]).attr("xlink:title");
	}
	return result;
}
function GetUnits(observation) {
	var query;
	var result = null;
	if(WaterMLVersion == 1) {
		query = includeNamespace ? "ns1\\:unitCode" : "unitCode";
		result=$($(observation).find(query)[0]).text();					
	} else {
		query = includeNamespace ? "wml2\\:uom" : "uom";		
		result = $($(observation).find(query)[0]).attr("code");
		//some WML services use attribute "uom" rather than "code". 
		if (result == undefined) {
			result = $($(observation).find(query)[0]).attr("uom");
		}
	}
	result = result ? result : ""; //prevents null exceptions
	return result;
}
function GetPropertyDefaults(property, sourceUnits, observation) {
	//Searches the attached wml-property-library.js for the 
	var result = [];
	var propertyLabel = "";
	var dimensions = "";
	var displayUnits = "";
	var conversionFactor;
	for(var j=0;j<propertyList.properties.length;j++){
		for(var k=0;k<propertyList.properties[j].synonyms.length;k++){
			if(propertyList.properties[j].synonyms[k].toLowerCase() == property.toLowerCase()){
				propertyLabel = propertyList.properties[j].name;
				dimensions = propertyList.properties[j].dimensions;
				displayUnits = propertyList.properties[j].displayUnits;
			}
		}
	}
	if (propertyLabel == ""){
		//Unknown property
		propertyLabel = "Unknown Property";
	}
	
	conversionFactor = ConvertUnits(dimensions, sourceUnits, displayUnits);
	
	//WML Version 1 services use unitCode vs. unitAbbreviation differently. This checks whether the other approach should be tried.
	if (conversionFactor <0) {
		query = includeNamespace ? "ns1\\:unitAbbreviation" : "unitAbbreviation";
		sourceUnits=$($(observation).find(query)[0]).text();
		conversionFactor = ConvertUnits(dimensions, sourceUnits, displayUnits);				
	}	
	
	if (conversionFactor <0){
		//Unknown units
		dimensions = "";
		displayUnits = "Unknown Units";
		conversionFactor = 1;			
	}		 
	
	result = {
		'propertyLabel': propertyLabel, 
		'dimensions': dimensions, 
		'sourceUnits': sourceUnits, 
		'displayUnits': displayUnits, 
		'conversionFactor': conversionFactor
	};
	return result;
}
function GetValues(observation) {
	//For WaterML 2, this currently only supports the Time-Value pair method of encoding
	var query;
	var points;
	var result = [];

	if (WaterMLVersion == 1){
		query = includeNamespace ? "ns1\\:value" : "value";
		points = $(observation).find(query);			
	}
	else {
		query = includeNamespace ? "wml2\\:point" : "point";
		points = $(observation).find(query);
	}

	for(var j=0;j<points.length;j++)
	{
		if (WaterMLVersion == 1){
			xText = $(points[j]).attr("dateTime");				
			yText = $(points[j]).text();
		}
		else {
			query = includeNamespace ? "wml2\\:time" : "time";				
			xText=$($(points[j]).find(query)[0]).text();				
			query = includeNamespace ? "wml2\\:value" : "value";				
			yText = $($(points[j]).find(query)[0]).text();
		}

		x = parseISO8601Date(xText);

		y = parseFloat(yText);
		yRound = isNaN(y) ? null : roundToSignificantFigures(y, 4);
		result.push([x, yRound]);
	}
	return result;
}
//***END PARSE XML***


function ConvertPointUnits(series, dimensions, fromUnit, toUnit){
	//dimensions represents the standard dimensional abbreviation (L for length, M for mass, etc.)
	//fromUnit and toUnit can be any synonym listed in the relevant dimensions in wml-property-library.js 
	var conversionFactor = ConvertUnits(dimensions, fromUnit, toUnit);
	result = series;
	if (conversionFactor>0){
		for (point in result){
			point[1] = point[1] * conversionFactor;
		}
	}
	return result;
}

function FindSeriesGaps(series, observation) {
	//Attempts to identify gaps in observation
	//If default spacing is identified in the observation xml, this is used.
	//Otherwise the time step between first two points is assumed to be the standard spacing
	//returns a series with a null point added at the start of each gap, so the series is graphed with a line break
}

function loadXMLDoc(dname){
	if (window.XMLHttpRequest) 
	  {
	  xhttp=new XMLHttpRequest();
	  }
	else //Internet Explorer 5/6
	  {
	  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	
	try {
		xhttp.open("GET",dname,false);
		xhttp.send();
	} catch(err) {
		console.log("XMLHttpRequest failed. Attempting proxy.");
		try {
			request = proxy + "?" + dname;
			console.log(request);
			xhttp.open("GET",request,false);
			xhttp.send();
			if (xhttp.responseXML == null){
				console.log("Proxy request failed. Check that server URL is allowed in proxy.config");
			}
		} catch(err2){
			console.log("Proxy failed. XML not loaded.");
			return -1;
		}
	}
	return xhttp.responseXML; 
} 

function AddTableElement(row, element, value){
	var elem = document.createElement(element);
	elem.innerHTML = value;
	row.appendChild(elem);
}

function getNextColor(){
	//The automatic color cycling isn't working properly, so this is a work around
	var colors = [
	   '#2f7ed8', 
	   //'#0d233a', 
	   '#8bbc21', 
	   '#910000', 
	   '#1aadce', 
	   '#492970',
	   '#f28f43', 
	   '#77a1e5', 
	   '#c42525', 
	   '#a6c96a'
	];
	
	var nextColor;
	if (curChart.highchartOptions.series.length){
		if(curChart.highchartOptions.series.length<colors.length-1){
			nextColor=colors[curChart.highchartOptions.series.length]
		}else{
			nextColor=colors[(curChart.highchartOptions.series.length%colors.length)];
		}
	} else {
		nextColor = colors[0];	
	}
	return nextColor;
}

function GetWMLVersion(xml){
	var version;
	if (xml.find('wml2\\:Collection').length>0) {
		version = 2;
		includeNamespace = true;
	} else if (xml.find('Collection').length>0) {
		version = 2;
		includeNamespace = false;		
	} else if (xml.find('ns1\\:timeSeriesResponse').length>0){
		version = 1;
		includeNamespace = true;		
	} else if (xml.find('timeSeriesResponse').length>0){
		version = 1;
		includeNamespace = false;			
	} else {
		version = 0;
	}
	WaterMLVersion = version;
}

function parseISO8601Date(s){
 //Source: http://n8v.enteuxis.org/2010/12/parsing-iso-8601-dates-in-javascript/
 //Modified to recognize additional formats
 
  // parenthese matches:
  // year month day    hours minutes seconds  
  // dotmilliseconds 
  // tzstring plusminus hours minutes
  var re = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))/;
  var re2 = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)/;
  var re3 = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)/;
  var d = [];
  d = s.match(re);
 
  // "2010-12-07T11:00:00.000-09:00" parses to:
  //  ["2010-12-07T11:00:00.000-09:00", "2010", "12", "07", "11",
  //     "00", "00", ".000", "-09:00", "-", "09", "00"]
  // "2010-12-07T11:00:00.000Z" parses to:
  //  ["2010-12-07T11:00:00.000Z", "2010", "12", "07", "11", 
  //     "00", "00", ".000", "Z", undefined, undefined, undefined]
  // "2010-12-07T11:00:00" parses to:
  //  ["2010-12-07T11:00:00.000Z", "2010", "12", "07", "11", 
  //     "00", "00", undefined, undefined, undefined, undefined, undefined]
 
  if (! d) {
	d = s.match(re2);  
	if (! d) {  
		d = s.match(re3)
		if (! d) {
		    throw "Couldn't parse ISO 8601 date string '" + s + "'";
		}
	}
  }
 
  // parse strings, leading zeros into proper ints
  var a = [1,2,3,4,5,6,10,11];
  for (var i in a) {
    d[a[i]] = parseInt(d[a[i]], 10);
  }
  d[7] = parseFloat(d[7]);
 
  // Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]])
  // note that month is 0-11, not 1-12
  // see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/UTC
  var ms = Date.UTC(d[1], d[2] - 1, d[3], d[4], d[5], d[6]);
 
  // if there are milliseconds, add them
  if (d[7] > 0) {  
    ms += Math.round(d[7] * 1000);
  }
 
  // if there's a timezone, calculate it
  if (d[8] != "Z" && d[10]) {
    var offset = d[10] * 60 * 60 * 1000;
    if (d[11]) {
      offset += d[11] * 60 * 1000;
    }
    if (d[9] == "-") {
      ms -= offset;
    }
    else {
      ms += offset;
    }
  }

  return ms
  //return new Date(ms);
};

function FindAxis(label) {
	for (var i = 0; i < curChart.highchartOptions.yAxis.length; i++) {
		if (curChart.highchartOptions.yAxis[i].title.text == label) {
			return i;
		}
	}
	//Axis not found. Create new axis	
	if (curChart.highchartOptions.yAxis.length % 2 == 1) {
		var oppositeSide = true;
	} else {
		var oppositeSide = false;
	}

	curChart.highchartOptions.yAxis.push({
		title: {
			text: label
		},
		min: 0,
		opposite: oppositeSide,
		labels:{
            formatter: function () {
				if (this.value > 100) {
					return Highcharts.numberFormat(this.value, 0,'.',',');
				}else {
					return this.value;
				}
			}
		}
	})
	return curChart.highchartOptions.yAxis.length - 1;
	
}

function ConvertUnits(dimensions, unitFrom, unitTo){
	//Returns a conversion factor between two units, searching all synonyms in the attached wml-property-library.js
	//dimensions represents the standard dimensional abbreviation (L for length, M for mass, etc.)
	fromConversion = -1;
	toConversion = -1;
	for(var i=0;i<unitsList.dimensions.length;i++){
		if (unitsList.dimensions[i].name.toLowerCase() == dimensions.toLowerCase()){
			for (var j=0;j<unitsList.dimensions[i].units.length;j++){
				for (var k=0;k<unitsList.dimensions[i].units[j].synonyms.length;k++){
					if (unitsList.dimensions[i].units[j].synonyms[k].toLowerCase() == unitFrom.toLowerCase()){
						fromConversion = unitsList.dimensions[i].units[j].toCommon;
					}
					if (unitsList.dimensions[i].units[j].synonyms[k].toLowerCase() == unitTo.toLowerCase()){
						toConversion = unitsList.dimensions[i].units[j].toCommon;
					}					
				}
			}
		}
	}
	if ((fromConversion >0) && (toConversion>0)){
		return (fromConversion / toConversion);
	} else {
		return -1;
	}
};

function roundToSignificantFigures(num, n) {
    if(num == 0) {
        return 0;
    }
    d = Math.ceil(log10(num < 0 ? -num: num));
    power = n - Math.round(d);
    magnitude = Math.pow(10, power);
    shifted = Math.round(num*magnitude);
    return shifted/magnitude;
}
function log10(x) {
  return Math.log(x) / Math.LN10;
}

function getQueryVariable(url, variable) {
    var query = url.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}
function replaceQueryVariable(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}
function removeQueryVariable(url, param){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    return baseURL + "?" + newAdditionalURL;
}

//This is an unused function that can serve as the starting point for adjusting the requested date
function ExtendPeriod(xmlLink){
	//Attempts to extend the period of the request from 1900 to the present
	//period parameter is not standartized across services, so this part may cause problems. This attempts to extend the request to approximately 100 years of data. 
	var newLink = xmlLink;
	if (getQueryVariable(newLink,"period")){
		newLink = replaceQueryVariable(newLink,"period", "P36500D");
	} else if (getQueryVariable(newLink, "from")){
		newLink = replaceQueryVariable(newLink,"from", "1900-01-01");			
		newLink = replaceQueryVariable(newLink,"to", "");
	} else if(getQueryVariable(newLink,"startDT")){
		newLink = replaceQueryVariable(newLink,"startDT", "1900-01-01");
		newLink = removeQueryVariable(newLink, "endDT");			
	//This replacement for Hilltop servers works, but leads to an extremely slow response
	//These observations are 5-15 minute intervals, rather than daily, so file sizes are much larger
	//} else if (getQueryVariable(newLink, "temporalFilter")){
	//	newLink = replaceQueryVariable(newLink,"temporalFilter", "om:phenomenomTime,1900-01-01/2100-01-01");
	}
	return newLink;
}