//This property list can be expanded as needed. dimensions and displayUnits should reference unitsList
//displayUnits are the units used in display, and can be changed to any unit or synonym in the corresponding dimensions list.
var propertyList = {
	properties: [
		{
			name: "Discharge",
			dimensions: "L^3/T",
			displayUnits: "cfs",
			synonyms: ["Discharge", "Q", "Streamflow, ft&#179;/s", "Flow"],
		},
		{
			name: "Runoff",
			dimensions: "L",
			displayUnits: "in", 
			synonyms: ["Runoff"],
		},	
		{
			name: "Precipitation",
			dimensions: "L",
			displayUnits: "in",
			synonyms: ["Precipitation", "IntervalPrecip", "Rainfall Total (1 day)"],
		},
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
					name: "in",
					synonyms: ["in", "inch"],
					toCommon: 0.0254,
				},
				{
					name: "mm",
					synonyms: ["mm", "millimeter", "millimetre"],
					toCommon: 0.001,
				},
			]
		},		
	]
};

