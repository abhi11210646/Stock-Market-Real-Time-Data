import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StockService } from './../service/stockService.service';
var seriesOptions = [],
    seriesCounter = 0,
    names = ['MSFT', 'AAPL', 'GOOG'];
declare var Highcharts: any;
const webSocket = new WebSocket('ws://localhost:4321/api/');
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
        webSocket.onopen = (event) => {
            webSocket.send('GET_ALL_DATA');
        };
        webSocket.onerror = (error) => {
            console.log('error', error);
        };
        webSocket.onmessage = (stockData) => {
            seriesOptions.push(JSON.parse(stockData.data));
            createChart();
        };
        webSocket.onclose = () => {
            console.log('connection closed');
        };

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