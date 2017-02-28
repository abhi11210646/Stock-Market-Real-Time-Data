import {Component } from '@angular/core';

@Component({
    selector: 'stock',
    templateUrl: './stock.template.html'
})
export class StockComponent {

    stock_metadata = [{name:"fb", desc:"facebook inc."}];
    constructor() {
        console.log("yoyo in stock ke mohalla");
    }
    
}