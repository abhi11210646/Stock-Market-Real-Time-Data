import { Component, AfterViewInit } from '@angular/core';
import { environment } from './../environments/environment';
const webSocket = new WebSocket(environment.API);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  seriesOptions = [];
  stock_code: string = '';
  showerror:boolean = false;
  constructor() {
    // console.log("webSocket--------->>",webSocket)
    webSocket.onopen = (event) => {
      webSocket.send(JSON.stringify({ stock: '', action: 'GET_ALL_STOCK' }));
    };
    webSocket.onmessage = (stockData) => {
      let parsedData = JSON.parse(stockData.data);
      if (parsedData.length) {
         this.showerror = false;
        this.seriesOptions = [];
        this.seriesOptions = this.seriesOptions.concat(parsedData);
      }else {
        this.showerror = true;
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
  addSockData(event: any) {
    event.preventDefault();
    webSocket.send(JSON.stringify({ stock: this.stock_code, action: 'NEW_STOCK' }));

  }
  delete(metadata: any) {
    if (this.seriesOptions.length > 1) {
       webSocket.send(JSON.stringify({ stock: metadata.name, action: 'DELETE' }));
      this.seriesOptions.splice(this.seriesOptions.indexOf(metadata), 1);
    }else {
      document.getElementById('error_stock').setAttribute('class', 'show');
    }
  }
}
