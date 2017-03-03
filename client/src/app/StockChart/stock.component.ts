import {Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'stock',
    templateUrl: './stock.template.html'
})
export class StockComponent implements OnInit {
    @Input() metadata:any;
    @Output() control = new EventEmitter();
    constructor() {
        //
    }
    ngOnInit() {
        console.log("yoyo in stock ke mohalla", this.metadata);
    }
    delete(name) {
        this.control.emit(name);
    }

}