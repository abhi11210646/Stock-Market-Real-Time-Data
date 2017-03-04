import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { StockComponent } from './StockChart/stock.component';
import { ChartComponent } from './StockChart/chart.component';

@NgModule({
  declarations: [
    AppComponent, StockComponent, ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  exports: [
    StockComponent, ChartComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
