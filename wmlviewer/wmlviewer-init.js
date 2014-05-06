"use strict"
//Get URL parameters
wmlviewer.urlObj = GetUrlObject();


//******UPDATE DEFAULT CONFIG VALUES BASED ON URL PARAMETERS***********
if ('xmin' in wmlviewer.urlObj.parameters) {wmlviewer.initialExtent.xmin = wmlviewer.urlObj.parameters.xmin;}
if ('ymin' in wmlviewer.urlObj.parameters) {wmlviewer.initialExtent.ymin = wmlviewer.urlObj.parameters.ymin;}
if ('xmax' in wmlviewer.urlObj.parameters) {wmlviewer.initialExtent.xmax = wmlviewer.urlObj.parameters.xmax;}		
if ('ymax' in wmlviewer.urlObj.parameters) {wmlviewer.initialExtent.ymax = wmlviewer.urlObj.parameters.ymax;}
if ('chartTitle' in wmlviewer.urlObj.parameters) {wmlviewer.chartTitle = wmlviewer.urlObj.parameters.chartTitle;}
if ('featureService' in wmlviewer.urlObj.parameters) {wmlviewer.featureService = wmlviewer.urlObj.parameters.featureService;}

//Initialize Map
wmlviewer.mainMap = new WMLMap();
wmlviewer.mainMap.chartVariableName = "mainChart"; //This links the map to the chart and should match the chart variable defined below
wmlviewer.mainMap.mapDiv = wmlviewer.mapDiv;
wmlviewer.mainMap.init();
AddServices();

//Initialize Chart
wmlviewer.mainChart = new WMLChart();
wmlviewer.mainChart.title = wmlviewer.chartTitle;
wmlviewer.mainChart.chartDiv = wmlviewer.chartDiv;
wmlviewer.mainChart.tableDiv = wmlviewer.tableDiv;
wmlviewer.mainChart.init();	

//Add Feature Services to Map
//This delays itself until the map has been created and loaded.
function AddServices(){
	if(wmlviewer.mainMap.map){
		if (wmlviewer.mainMap.map.loaded)
		{
			if (isArray(wmlviewer.featureService)){
				for (var i = 0; i < wmlviewer.featureService.length; i++){
					try {
						wmlviewer.mainMap.AddFeatureService(wmlviewer.featureService[i]);
					} catch(err) {
						console.log("Invalid feature service provided in URL")
					}			
				}
			} else {
				try {
					wmlviewer.mainMap.AddFeatureService(wmlviewer.featureService);
				} catch(err) {
					console.log("Invalid feature service provided in URL")
				}
			}
			} else{
				//Wait and try again
				setTimeout(AddServices,50);
		}
	} else{
		//Wait and try again
		setTimeout(AddServices,50);
	}
}
	
function GetUrlObject(options) {
	//From https://gist.github.com/aymanfarhat/5608517
	"use strict";
	/*global window, document*/
	 
	var url_search_arr,
		option_key,
		i,
		urlObj,
		get_param,
		key,
		val,
		url_query,
		url_get_params = {},
		a = document.createElement('a'),
		default_options = {
		'url': window.location.href,
		'unescape': true,
		'convert_num': true
		};
	 
	if (typeof options !== "object") {
		options = default_options;
	} else {
		for (option_key in default_options) {
			if (default_options.hasOwnProperty(option_key)) {
				if (options[option_key] === undefined) {
					options[option_key] = default_options[option_key];
				}
			}
		}
	}
	 
	a.href = options.url;
	url_query = a.search.substring(1);
	url_search_arr = url_query.split('&');
	 
	if (url_search_arr[0].length > 1) {
		for (i = 0; i < url_search_arr.length; i += 1) {
			get_param = url_search_arr[i].split("=");
			 
			if (options.unescape) {
				key = decodeURI(get_param[0]);
				val = decodeURI(get_param[1]);
			} else {
				key = get_param[0];
				val = get_param[1];
			}
			 
			if (options.convert_num) {
				if (val.match(/^\d+$/)) {
					val = parseInt(val, 10);
				} else if (val.match(/^\d+\.\d+$/)) {
					val = parseFloat(val);
				}
			}
	 
			if (url_get_params[key] === undefined) {
				url_get_params[key] = val;
			} else if (typeof url_get_params[key] === "string") {
				url_get_params[key] = [url_get_params[key], val];
			} else {
				url_get_params[key].push(val);
			}
			 
			get_param = [];
			}
		}
	 
	urlObj = {
		protocol: a.protocol,
		hostname: a.hostname,
		host: a.host,
		port: a.port,
		hash: a.hash.substr(1),
		pathname: a.pathname,
		search: a.search,
		parameters: url_get_params
	};
	 
	return urlObj;
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}