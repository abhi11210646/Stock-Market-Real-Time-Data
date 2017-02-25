import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class StockService {
    url: string;
    constructor(private _http: Http) {
        this.url = 'https://www.quandl.com/api/v3/datasets/WIKI/FB.json?column_index=4&start_date=2014-01-01&end_date=2016-12-31&api_key=-8YKHbxdCgW232Jia8GP';
        console.log(Observable);
  }
    getAllData(): Observable<any> {
        return this._http.get(this.url)
        .map((response: Response) => {
             return response.json();
         })
        .catch((error) => {
              return error;
        });
    }
}
