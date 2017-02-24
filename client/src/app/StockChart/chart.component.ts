import { Component, OnInit, AfterViewInit } from '@angular/core';
var seriesOptions = [],
    seriesCounter = 0,
    names = ['MSFT', 'AAPL', 'GOOG'];
declare var JQuery:any;
declare var Highcharts:any;
@Component({
    selector: 'chart',
    templateUrl: './chart.template.html'
})

export class ChartComponent implements OnInit, AfterViewInit {
    constructor() {
        console.log("yoyo in chart ke mohalla");
    }
    ngOnInit() {
        //
    }
    ngAfterViewInit() {
       names.forEach(function (name, i) {
        JQuery.getJON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',    function (data) {

        seriesOptions[i] = {
            name: name,
            data: data
        };
        seriesCounter += 1;

        if (seriesCounter === names.length) {
            createChart();
        }
    });
    });
    }
}
function createChart() {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });
}