import {Component } from '@angular/core';

@Component({
    selector: 'stock',
    templateUrl: './stock.template.html'
})
export class StockComponent {
    stock_code:string = '';
    stock_metadata = [];
    constructor() {
        console.log("yoyo in stock ke mohalla");
    }
    getSockData(event:any) {
        event.preventDefault();
        this.stock_metadata.push({name:"abhi", desc:"yoyo"});
    }
}