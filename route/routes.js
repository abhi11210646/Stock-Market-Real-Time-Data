var router = require('express').Router();
const moment = require('moment');
var qs = require('query-string');
const Promise = require('bluebird');
const Stock = require('mongoose').model('Stock');
const got = require('got');
const base_url = 'https://www.quandl.com/api/v3/datasets/WIKI/', stock_name = '';
module.exports = (websockets) => {
    router.ws('/', (ws, req) => {
        let series_data = [];
        ws.on('message', (msg) => {
            msg = JSON.parse(msg);
            if (msg.action == 'NEW_STOCK') {
                Stock.find({ name: msg.stock.toUpperCase() }).then((stockk) => {
                    if (!stockk.length) {
                        console.log(msg);
                        newStock(series_data, msg, websockets, ws);
                    } else {
                        throw new Error('Already Exists');
                    }
                }).catch((error) => {
                    console.log('mongoose error---->>', error);
                    ws.send(JSON.stringify([]));
                });
            } else if (msg.action == 'GET_ALL_STOCK') {
                getAllStock(series_data, websockets);
            } else {
                if (msg.action == 'DELETE') {
                    Stock.remove({ name: msg.stock.toUpperCase() }).exec();
                    series_data = [];
                    getAllStock(series_data, websockets);
                }
            }
        });
    });
    return router;
};

function newStock(series_data, msg, websockets, ws)  {
    Promise.coroutine(function *(){
         let response = yield makeRequest(msg.stock.toUpperCase());
        let series = yield saveStockReturnSeriesObject(response);
        series_data.push(series);
        return series_data;
    }).apply(this).then((series_data)=>{
        websockets.getWss().clients.forEach(
            (client) => {
                client.send(JSON.stringify(series_data));
            });
    }).catch((error)=>{
         console.log('i think got error---->>', error);
         ws.send(JSON.stringify([]));
    });

}
function saveStockReturnSeriesObject(response){
    return new Promise((resolve, reject)=>{
         let dataset = generalizeResponse(response);
            let series =  {
                name: dataset.dataset_code.toUpperCase(),
                data: dataset.data,
                desc: dataset.name,
                refreshed_at: dataset.refreshed_at
            };
            Stock.find({ name:dataset.dataset_code.toUpperCase()}).then((stockk) => {
                if(stockk.length) {
                    console.log(stockk[0].name, " updated.");
                     Stock.remove({ name: stockk.name.toUpperCase() }).exec();
                }
                let stock = new Stock(series);
                stock.save();
            }).catch((err)=>{
                reject(err);
            });
         resolve(series);
    });
   
       
}
function getAllStock(series_data, websockets) {
      
      Promise.coroutine(function *(){
         let stocks = yield Stock.find({}, { _id: 0 });
          for(let stockk of stocks) {
            if((moment().diff(moment(stockk.refreshed_at), 'minutes'))>1430) {
                console.log('updating....',stockk.name, 'stock');
                let response = yield makeRequest(stockk.name.toUpperCase());
                let series = yield saveStockReturnSeriesObject(response);
                series_data.push(series);
              
            }else {
                   console.log('getting....',stockk.name, 'stock');
                let series = {
                        name: stockk.name,
                        data: stockk.data,
                        desc: stockk.desc
                    };
                    series_data.push(series);
            }
            
        }
         return series_data;
      }).apply(this).then(()=>{
          websockets.getWss().clients.forEach((client) => {
            client.send(JSON.stringify(series_data));
        });
      });
        
}
function makeRequest(stock) {
    let date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
    let OPTIONS = {
        'column_index': 4,
        'start_date': `${year - 1}-${month}-${day}`,
        'end_date': `${year}-${month}-${day}`,
        'api_key': process.env.api_key
    };
    this.stock_name = `${stock}.json?`;
    return got(base_url + this.stock_name + qs.stringify(OPTIONS));
}
function generalizeResponse(response) {
    let dataset = JSON.parse(response.body).dataset,
        data = parseTheDate(dataset.data);
        data.sort((currDate, nxtDate)=>{
            return currDate[0]-nxtDate[0];
        });
        dataset.data = data;
        return dataset;
}
function parseTheDate(dataset) {
    return dataset.map((stock) => {
        stock[0] = new Date(stock[0]).getTime();
        return stock;
    });
}



