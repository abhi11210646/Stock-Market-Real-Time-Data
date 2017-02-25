import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StockService } from './../service/stockService.service';
var seriesOptions = [],
    seriesCounter = 0,
    names = ['MSFT', 'AAPL', 'GOOG'];
declare var Highcharts: any;
@Component({
    selector: 'chart',
    templateUrl: './chart.template.html'
})

export class ChartComponent implements OnInit, AfterViewInit {
    constructor(private _StockService: StockService) {
        console.log("yoyo in chart ke mohalla");
    }
    ngOnInit() {
        //
    }
    ngAfterViewInit() {
        this._StockService.getAllData().subscribe((response) => {
            console.log('-->', response);
        }, (error) => {
                console.log('khemu--->', error);
        }
        );
        seriesOptions[0] = {
            name: 'aaap',
            data: [1, 2, 3, 4, 5, 6, 7]
        };
        seriesOptions[1] = {
            name: 'hUM',
            data: [10, 20, 30, 40, 50, 60, 70]
        };
        createChart();

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