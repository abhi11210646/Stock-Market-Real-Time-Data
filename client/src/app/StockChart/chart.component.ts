import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

declare var Highcharts: any;

@Component({
    selector: 'chart',
    templateUrl: './chart.template.html'
})

export class ChartComponent implements OnInit, OnChanges {
    @Input() seriesOptions;
    constructor() {
        // console.log("yoyo in chart ke mohalla");
    }

    ngOnInit() {

        this.createChart();

    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log('change detection',this.seriesOptions);
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