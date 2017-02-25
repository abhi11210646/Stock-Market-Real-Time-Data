import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { StockComponent } from './StockChart/stock.component';
import { ChartComponent } from './StockChart/chart.component';
import { StockService } from './service/stockService.service';
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
  providers: [StockService],
  bootstrap: [AppComponent]
})
export class AppModule { }
