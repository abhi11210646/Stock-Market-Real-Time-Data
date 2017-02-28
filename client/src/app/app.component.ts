import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  stock_code:string = '';
  constructor() {
    //
  }
  getSockData(event:any) {
        event.preventDefault();
        // this.stock_metadata.push({name:"abhi", desc:"yoyo"});
    }
}
