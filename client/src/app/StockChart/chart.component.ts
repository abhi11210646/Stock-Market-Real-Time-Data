import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StockService } from './../service/stockService.service';

declare var Highcharts: any;

@Component({
    selector: 'chart',
    templateUrl: './chart.template.html'
})

export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() seriesOptions;
    constructor(private _StockService: StockService) {
        console.log("yoyo in chart ke mohalla");
    }
    ngOnInit() {
        console.log("seriesOptions-------->>>",this.seriesOptions);
        this.createChart();
    }
    ngAfterViewInit() {
        //
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log("gal te sun le");
        this.createChart();
    }

    createChart() {

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

            series: this.seriesOptions
        });
    }
}