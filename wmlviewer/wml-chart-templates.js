// JavaScript Document
//This file contains various templates that adjust the look and feel of the basic Highchart, such as adding custom buttons.

//Template used by World Water Online
var wwoTemplate = {
    chart: {
		zoomType: 'x',
        renderTo: '',
        defaultSeriesType: 'area',
    },
    title: {
        text: 'WaterML Chart'
    },
	subtitle: {
		text: document.ontouchstart === undefined ?
			'Click and drag in the plot area to zoom in' :
			'Pinch the chart to zoom in'
	},
    xAxis: {
        type: 'datetime'
    },
	yAxis: [],
	plotOptions: {
		area: {
			lineWidth: 1,
			marker: {
				enabled: false
			},
			shadow: false,
			states: {
				hover: {
					lineWidth: 2
				}
			},
			threshold: null
		}
	},

	lang: {
		removeHidden_key: 'Remove Hidden Series', //alt text for button
		removeAll_key: 'Remove All Series',
		download_key: 'Download CSV', //alt text for button
	},
	
	exporting: {
		buttons: {
			contextButton: {
				enabled: false,
			},
			removeHiddenSeries: {
				onclick: function() {
					RemoveHiddenSeries();
				},
				align: 'right',
				x: -30,
				symbol: 'url(' + wmlviewerPath + 'images/subtract-icon.png)',
				_titleKey: 'removeHidden_key',
			},
			removeAllSeries: {
				onclick: function() {
					RemoveAllSeries();
				},
				align: 'right',
				x: 0,
				symbol: 'url(' + wmlviewerPath + 'images/close-icon.png)',
				_titleKey: 'removeAll_key',
			},			
			downloadCSV: {
				onclick: function() {
					Highcharts.post('http://www.highcharts.com/studies/csv-export/csv.php', {
                    	csv: this.getCSV()
                	})
				},
				align: 'right',
				x: -60,
				//symbol: 'triangle-down',
				symbol: 'url(' + wmlviewerPath + 'images/download-icon.png)',
				_titleKey: 'download_key',
			}			
		}
	},

    series: []
	
};