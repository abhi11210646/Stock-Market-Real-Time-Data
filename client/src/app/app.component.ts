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

    webSocket.onopen = (event) => {
      webSocket.send(JSON.stringify({ stock: '', action: 'GET_ALL_STOCK' }));
    };
    webSocket.onmessage = (stockData) => {
      let parsedData = JSON.parse(stockData.data);
      if (parsedData.length) {
        this.seriesOptions = [];
        this.seriesOptions = this.seriesOptions.concat(parsedData);
      }
    };
  }
  ngAfterViewInit() {

    webSocket.onerror = (error) => {
      console.log('error', error);
      webSocket.close();

    };
    webSocket.onclose = () => {
      console.log('connection closed');
    };
  }
  getSockData(event: any) {
    event.preventDefault();
    webSocket.send(JSON.stringify({ stock: this.stock_code, action: 'NEW_STOCK' }));

  }
  delete(metadata: string) {
    this.seriesOptions.splice(this.seriesOptions.indexOf(metadata), 1);
    this.seriesOptions = this.seriesOptions;
    console.log(this.seriesOptions);
  }
}
