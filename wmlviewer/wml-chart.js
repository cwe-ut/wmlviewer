//This requires the following javascript to be included in the header:
//jquery (tested on jquery.1.9.1.min.js), highcharts/highcharts.js, highcharts/modules/exporting.js, highcharts/modules/export-csv.js, wml-chart-templates.js and wml-property-library.js

//jquery is used for XML navigation as the .getElementsByTagName method had issues with cross browser compatability
"use strict";

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
		wmlviewer.curChart = self;
		wmlviewer.curChart.highchartOptions.chart.renderTo = wmlviewer.curChart.chartDiv;
		wmlviewer.curChart.highchartOptions.title.text = wmlviewer.curChart.title;
		wmlviewer.curChart.chart = new Highcharts.Chart(wmlviewer.curChart.highchartOptions);		
		
		//Initialize Table
		if (wmlviewer.curChart.tableDiv){
			wmlviewer.curChart.WMLTable = new WMLTable();
			wmlviewer.curChart.WMLTable.tableDiv = wmlviewer.curChart.tableDiv;
			wmlviewer.curChart.WMLTable.init()
		}		
	}
	
	this.AddLink = function(wmlLink, linkSettings) {
		wmlviewer.curChart = self;
		AddWaterML(wmlLink,linkSettings);
	}
	
	this.RemoveHiddenSeries = function() {
		wmlviewer.curChart = self;
		RemoveHiddenSeries();
	}
	this.RemoveAllSeries = function() {
		wmlviewer.curChart = self;
		RemoveAllSeries();
	}
}
//*********END CHART WIDGET*************

//*********TABLE WIDGET*****************
//Created automatically by the Chart Widget
function WMLTable() {
	var self = this;
	var header, row;
	this.tableDiv = null;
	this.id = "wmlTable";
	this.headings = ["Site Name", "Property", "Data Source"];
	this.table = null;

	this.init = function() {
		self.table = document.createElement('table');
		$('#' + self.tableDiv).append(self.table);
		
		header = self.table.createTHead();
		row = header.insertRow();
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
	var defaults, xmlLinkAdj, xmlDoc, xml;
	var observations, seriesName, observedProperty, sourceUnits;
	var propertyDefaults, seriesValues, seriesValuesConverted;
	
	//Default linkOptions
	defaults = {
		startDate: null,
		endDate: null,
		previousPeriod: null,
		previousUnits: "days",
	};
	linkSettings = $.extend(true,{}, defaults, linkSettings);
	
	//Adjust period prior to server request
	xmlLinkAdj =  xmlLink;
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
	xmlDoc = loadXMLDoc(xmlLinkAdj);
	if (xmlDoc == -1) {
		return -1;
	}
	
	//Convert to format useful for jQuery
	xml = $(xmlDoc); 
	
	//Identify WML version and includeNamespace value 
	GetWMLVersion(xml); //currently defined as global variables. may want to restrict the scope
	
	if (wmlviewer.WaterMLVersion < 1) {
		alert("Error adding series: WaterML Version not recognized");
		return null		
	} else {
		//Extract data from xml and add to chart
		observations = GetObservations(xml); //WaterML2 allows for multiple time series observations per file, though typically there will be only one.
		for (var i=0;i<observations.length;i++) {
			//Get series metadata
			seriesName = GetSiteName(observations[i]);
			observedProperty = GetObservedProperty(observations[i]);
			sourceUnits = GetUnits(observations[i]);
			propertyDefaults = GetPropertyDefaults(observedProperty, sourceUnits, observations[i]);
			//Get series values
			seriesValues = GetValues(observations[i]);
			if (seriesValues.length > 0){
				//Convert series units
				seriesValuesConverted = ConvertPointUnits(seriesValues,propertyDefaults.dimensions, propertyDefaults.sourceUnits, propertyDefaults.displayUnits);
				//Add series to chart and table
				AddSeries(seriesValuesConverted,seriesName,propertyDefaults, xmlLinkAdj);
			} else {
				alert("Series has no values.");
			}
		}
	}
}
function RemoveHiddenSeries(){
	//Remove all hidden series
	//Start from the highest index so the subsequent indices don't change
	var curSeries = wmlviewer.curChart.chart.series.length - 1;
		
	while (curSeries > -1){
		if (wmlviewer.curChart.chart.series[curSeries].visible == false) {
			wmlviewer.curChart.chart.series[curSeries].remove(false);
			wmlviewer.curChart.highchartOptions.series.splice(curSeries, 1);
			if (wmlviewer.curChart.WMLTable) {
				wmlviewer.curChart.WMLTable.table.deleteRow(curSeries+1);
			}
		} 
		curSeries = curSeries - 1;
	}
	wmlviewer.curChart.chart.redraw();	
}
function RemoveAllSeries(){
	var curSeries = wmlviewer.curChart.chart.series.length - 1;
		
	while (curSeries > -1){
		wmlviewer.curChart.chart.series[curSeries].remove(false);
		wmlviewer.curChart.highchartOptions.series.splice(curSeries, 1);
		if (wmlviewer.curChart.WMLTable) {
			wmlviewer.curChart.WMLTable.table.deleteRow(curSeries+1);
		}
		 
		curSeries = curSeries - 1;
	}
	wmlviewer.curChart.chart.redraw();		
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
	//Function Stub
	//Changes the given url to request ending at a specified date	
	var urlAdj = url;
	return urlAdj;
}
//***END MODIFY URL REQUEST***

function AddSeries(values, seriesName, propertyDefaults, url){
	//Function Stub
	//Set appropriate series chart options and add series to chart
	var seriesOptions, seriesColor;
	var fullLabel = propertyDefaults.propertyLabel + " (" + propertyDefaults.displayUnits + ")";
	var axis = FindAxis(fullLabel);	
	var tableBody, row, rowValues;

	seriesColor = getNextColor();
	
	seriesOptions = {
		name: seriesName,
		type: propertyDefaults.seriesType,
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
	wmlviewer.curChart.highchartOptions.series.push(seriesOptions);
		
	//redraw chart
	wmlviewer.curChart.chart = new Highcharts.Chart(wmlviewer.curChart.highchartOptions)
			
	//update table
	if (wmlviewer.curChart.WMLTable) {
		tableBody = wmlviewer.curChart.WMLTable.table.getElementsByTagName('tbody')[0];
		row = tableBody.insertRow(tableBody.rows.length);

		rowValues = [seriesName, wmlviewer.curChart.highchartOptions.yAxis[seriesOptions.yAxis].title.text, '<a href="' + url + '" target="_blank">WaterML</a>'];
		for (var i=0; i<rowValues.length;i++){
			AddTableElement(row, 'td', rowValues[i]);
		}
	}	
}

//***PARSE XML***
function GetObservations(xml) {
	var query;
	if(wmlviewer.WaterMLVersion == 1){
		query = wmlviewer.includeNamespace ? "ns1\\:timeSeries" : "timeSeries";
	} else {
		query = wmlviewer.includeNamespace ? "om\\:OM_Observation" : "OM_Observation";
	}
	return xml.find(query);	
}
function GetSiteName(observation){
	var query;
	var result = null;
	if(wmlviewer.WaterMLVersion == 1){
		query = wmlviewer.includeNamespace ? "ns1\\:siteName" : "siteName";
		result=$($(observation).find(query)[0]).text();
	} else {
		query = wmlviewer.includeNamespace ? "om\\:featureOfInterest" : "featureOfInterest";
		result=$($(observation).find(query)[0]).attr("xlink:title");
	}	
	return result;
}
function GetObservedProperty(observation) {
	var query;
	var result = null;
	if(wmlviewer.WaterMLVersion == 1) {
		query = wmlviewer.includeNamespace ? "ns1\\:variableName" : "variableName";
		result=$($(observation).find(query)[0]).text();
	} else {
		query = wmlviewer.includeNamespace ? "om\\:observedProperty" : "observedProperty";
		result = $($(observation).find(query)[0]).attr("xlink:title");
	}
	return result;
}
function GetUnits(observation) {
	var query;
	var result = null;
	if(wmlviewer.WaterMLVersion == 1) {
		query = wmlviewer.includeNamespace ? "ns1\\:unitCode" : "unitCode";
		result=$($(observation).find(query)[0]).text();					
	} else {
		query = wmlviewer.includeNamespace ? "wml2\\:uom" : "uom";		
		result = $($(observation).find(query)[0]).attr("code");
		//some WML services use attribute "uom" or "title" rather than "code". 
		if (result == undefined) {
			result = $($(observation).find(query)[0]).attr("uom");
		}
		if (result == undefined) {
			result = $($(observation).find(query)[0]).attr("xlink:title");
		}		
		
	}
	result = result ? result : ""; //prevents null exceptions
	return result;
}
function GetPropertyDefaults(property, sourceUnits, observation) {
	//Searches the attached wml-property-library.js for the 
	var query;
	var result = [];
	var propertyLabel = "";
	var dimensions = "";
	var displayUnits = "";
	var seriesType = "area";
	var conversionFactor;
	for(var j=0;j<propertyList.properties.length;j++){
		for(var k=0;k<propertyList.properties[j].synonyms.length;k++){
			if(propertyList.properties[j].synonyms[k].toLowerCase() == property.toLowerCase()){
				propertyLabel = propertyList.properties[j].name;
				dimensions = propertyList.properties[j].dimensions;
				displayUnits = propertyList.properties[j].displayUnits;
				seriesType = propertyList.properties[j].seriesType;
			}
		}
	}
	if (propertyLabel == ""){
		//Unknown property
		propertyLabel = "Unknown Property";
	}
	
	conversionFactor = ConvertUnits(dimensions, sourceUnits, displayUnits);
	
	//WML Version 1 services use unitCode, unitAbbreviation, and units differently. This checks whether the other approach should be tried.
	if (conversionFactor <0) {
		query = wmlviewer.includeNamespace ? "ns1\\:unitAbbreviation" : "unitAbbreviation";
		sourceUnits=$($(observation).find(query)[0]).text();
		conversionFactor = ConvertUnits(dimensions, sourceUnits, displayUnits);				
	}	
	if (conversionFactor <0) {
		query = wmlviewer.includeNamespace ? "ns1\\:units" : "units";
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
		'conversionFactor': conversionFactor,
		'seriesType': seriesType,
	};
	return result;
}
function GetValues(observation) {
	//For WaterML 2, this currently only supports the Time-Value pair method of encoding
	var query, points, xText, yText, x, y, yRound;
	var result = [];

	if (wmlviewer.WaterMLVersion == 1){
		query = wmlviewer.includeNamespace ? "ns1\\:value" : "value";
		points = $(observation).find(query);			
	}
	else {
		query = wmlviewer.includeNamespace ? "wml2\\:point" : "point";
		points = $(observation).find(query);
	}

	for(var j=0;j<points.length;j++)
	{
		if (wmlviewer.WaterMLVersion == 1){
			xText = $(points[j]).attr("dateTime");				
			yText = $(points[j]).text();
		}
		else {
			query = wmlviewer.includeNamespace ? "wml2\\:time" : "time";				
			xText=$($(points[j]).find(query)[0]).text();
			query = wmlviewer.includeNamespace ? "wml2\\:value" : "value";				
			yText = $($(points[j]).find(query)[0]).text();
		}
		if (xText) {
			x = parseISO8601Date(xText);
			y = parseFloat(yText);
			yRound = isNaN(y) ? null : roundToSignificantFigures(y, wmlviewer.sigFigs);
			result.push([x, yRound]);
		}
	}
	return result;
}
//***END PARSE XML***


function ConvertPointUnits(series, dimensions, fromUnit, toUnit){
	//dimensions represents the standard dimensional abbreviation (L for length, M for mass, etc.)
	//fromUnit and toUnit can be any synonym listed in the relevant dimensions in wml-property-library.js 
	var result;
	var conversionFactor = ConvertUnits(dimensions, fromUnit, toUnit);
	result = series;
	if (conversionFactor>0){
		for (var i=0; i<result.length;i++){
			result[i][1] = isNaN(result[i][1]) ? null : roundToSignificantFigures(result[i][1] * conversionFactor, wmlviewer.sigFigs);
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
	var xhttp, request;
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
			request = wmlviewer.proxy + "?" + dname;
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
	if (wmlviewer.curChart.highchartOptions.series.length){
		if(wmlviewer.curChart.highchartOptions.series.length<colors.length-1){
			nextColor=colors[wmlviewer.curChart.highchartOptions.series.length]
		}else{
			nextColor=colors[(wmlviewer.curChart.highchartOptions.series.length%colors.length)];
		}
	} else {
		nextColor = colors[0];	
	}
	return nextColor;
}

function GetWMLVersion(xml){
	var version;
	if (xml.find('om\\:OM_Observation').length>0) {
		version = 2;
		wmlviewer.includeNamespace = true;
	} else if (xml.find('OM_Observation').length>0) {
		version = 2;
		wmlviewer.includeNamespace = false;		
	} else if (xml.find('ns1\\:timeSeriesResponse').length>0){
		version = 1;
		wmlviewer.includeNamespace = true;		
	} else if (xml.find('timeSeriesResponse').length>0){
		version = 1;
		wmlviewer.includeNamespace = false;			
	} else {
		version = 0;
	}
	wmlviewer.WaterMLVersion = version;
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
  var re4 = /(\d{4})-(\d\d)-(\d\d)/;
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
  // "2010-12-07" parses to:
  // ["2010-12-07", "2010", "12", "07", "undefined", 
  //     "undefined", "undefined", undefined, undefined, undefined, undefined, undefined]
 
  if (! d) {
	d = s.match(re2);  
	if (! d) {  
		d = s.match(re3)
		if (! d) {
			d = s.match(re4)
			if (! d) {
			    throw "Couldn't parse ISO 8601 date string '" + s + "'";
			}
			d[4] = 0;
			d[5] = 0;
			d[6] = 0;
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
	var oppositeSide;
	for (var i = 0; i < wmlviewer.curChart.highchartOptions.yAxis.length; i++) {
		if (wmlviewer.curChart.highchartOptions.yAxis[i].title.text == label) {
			return i;
		}
	}
	//Axis not found. Create new axis	
	if (wmlviewer.curChart.highchartOptions.yAxis.length % 2 == 1) {
		oppositeSide = true;
	} else {
		oppositeSide = false;
	}

	wmlviewer.curChart.highchartOptions.yAxis.push({
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
	return wmlviewer.curChart.highchartOptions.yAxis.length - 1;
	
}

function ConvertUnits(dimensions, unitFrom, unitTo){
	//Returns a conversion factor between two units, searching all synonyms in the attached wml-property-library.js
	//dimensions represents the standard dimensional abbreviation (L for length, M for mass, etc.)
	var fromConversion = -1;
	var toConversion = -1;
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
	var d, power, magnitude, shifted;
	
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