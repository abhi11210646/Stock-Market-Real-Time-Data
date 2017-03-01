import { Component, AfterViewInit } from '@angular/core';
const webSocket = new WebSocket('ws://localhost:4321/api/');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  seriesOptions = [];
  stock_code: string = '';
  constructor() {
    //
  }
  ngAfterViewInit() {
    webSocket.onopen = (event) => {
      webSocket.send(JSON.stringify({ stock: '', action: 'GET_ALL_STOCK' }));
    };
    webSocket.onerror = (error) => {
      console.log('error', error);
      webSocket.close();
    };
    webSocket.onmessage = (stockData) => {
      this.seriesOptions = [];
      this.seriesOptions = this.seriesOptions.concat(JSON.parse(stockData.data));
    };
    webSocket.onclose = () => {
      console.log('connection closed');
    };
  }
  getSockData(event: any) {
    event.preventDefault();
    webSocket.send(JSON.stringify({ stock: this.stock_code, action: 'NEW_STOCK' }));
    // this.stock_metadata.push({name:"abhi", desc:"yoyo"});
  }
}
