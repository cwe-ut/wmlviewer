//This property list can be expanded as needed. dimensions and displayUnits should reference unitsList
//displayUnits are the units used in display, and can be changed to any unit or synonym in the corresponding dimensions list.
"use strict";
	
var propertyList = {
	properties: [
		{
			name: "Discharge",
			dimensions: "L^3/T",
			displayUnits: "cfs",
			seriesType: "area",
			synonyms: ["Discharge", "Q", "Streamflow, ft&#179;/s", "Flow"],
		},
		{
			name: "Runoff",
			dimensions: "L",
			displayUnits: "in", 
			seriesType: "column",
			synonyms: ["Runoff"],
		},	
		{
			name: "Precipitation",
			dimensions: "L",
			displayUnits: "in",
			seriesType: "column",			
			synonyms: [
                "Precipitation", 
                "IntervalPrecip", 
                "Rainfall Total (1 day)", 
                "Precipitation hourly total"
            ]
		},
		{
			name: "Evaporation",
			dimensions: "L",
			displayUnits: "in",
			seriesType: "area", 
			synonyms: ["Evaporation", "Evapotranspiration", "total evapotranspiration"]
		},			
        {
			name: "Water Level",
			dimensions: "L",
			displayUnits: "ft",
			seriesType: "area",			
			synonyms: ["Water Level", "S"],
		},        {
			name: "Soil Moisture",
			dimensions: "M/L^2",
			displayUnits: "kg/m^2",
			seriesType: "area",			
			synonyms: ["Soil Moisture", "0-100 cm layer 1 Soil moisture content"],
		},
		{
			name: "Storage",
			dimensions: "L^3",
			displayUnits: "acre-ft",
			seriesType: "area",			
			synonyms: ["Storage", "Reservoir Storage", "ResV"],
		}
	]
};

var unitsList = {
	dimensions: [
		{
			name: "L^3/T",
			commonUnit: "m^3/s",
			units: [
				{
					name: "m^3/s",
					synonyms: ["m^3/s", "cumec", "m&#179;/s", "m3/s", "m³/s"],
					toCommon: 1,
				},			
				{
					name: "cfs",
					synonyms: ["cfs", "ft&#179;/s", "ft3/s", "ft^3/s", "ft³/s"],
					toCommon: 0.0283168466,
				},
				{
					name: "l/s",
					synonyms: ["l/s"],
					toCommon: 0.001,
				},				
			]
		},
		{
			name: "L",
			commonUnit: "m",
			units: [
				{
					name: "m",
					synonyms: ["m","meter", "metre"],
					toCommon: 1,
				},	
				{
					name: "cm",
					synonyms: ["cm","centimeter", "centimetre"],
					toCommon: 0.01,
				},		
				{
					name: "ft",
					synonyms: ["ft","foot", "feet"],
					toCommon: 0.3048
				},	
				{
					name: "in",
					synonyms: ["in", "inch"],
					toCommon: 0.0254,
				},
				{
					name: "mm",
					synonyms: ["mm", "millimeter", "millimetre"],
					toCommon: 0.001,
				},
                {
					name: "kg water/m^2",
					synonyms: ["kg water/m^2", "kg/m^2", "Kilograms per square meter"],
					toCommon: 0.001
				}
			]
		},
		{
			name: "M/L^2",
			commonUnit: "kg/m^2",
			units: [
				{
					name: "kg/m^2",
					synonyms: ["kg/m^2", "Kilograms per square meter"],
					toCommon: 1,
				},
			]
		},
		{
			name: "L^3",
			commonUnit: "m^3",
			units: [
				{
					name: "m^3",
					synonyms: ["m^3", "cubic meter", "cubic meters"],
					toCommon: 1,
				},
				{
					name: "acre-ft",
					synonyms: ["acre-ft", "acre-feet", "acre-foot", "ac-ft"],
					toCommon: 1233.48185532
				}
			]
		}
	]
};