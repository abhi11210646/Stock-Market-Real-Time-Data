var router = require('express').Router();
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
    makeRequest(msg.stock.toUpperCase()).then((response) => {
                let series = saveStockReturnSeriesObject(response);
                series_data.push(series);
                websockets.getWss().clients.forEach((client) => {
                    client.send(JSON.stringify(series_data));
                });
        }).catch((error) => {
                console.log('i think got error---->>', error);
                ws.send(JSON.stringify([]));
            });
}
function saveStockReturnSeriesObject(response){
    let dataset = generalizeResponse(response);
        let series =  {
            name: dataset.dataset_code.toUpperCase(),
            data: dataset.data,
            desc: dataset.name,
            refreshed_at: dataset.refreshed_at
        };
        Stock.find({ name:dataset.dataset_code.toUpperCase()}).then((stockk) => {
            if(stockk.length) {
                console.log(stockk.name, " updated.");
                 Stock.remove({ name: stockk.name.toUpperCase() }).exec();
            }
            let stock = new Stock(series);
            stock.save();
        }).catch((err)=>{
            return err;
        });
        return series;
}
function getAllStock(series_data, websockets) {
    Stock.find({}, { _id: 0 }).then((stocks) => {
        
        stocks.forEach((stockk) => {
            if(new Date(stockk.refreshed_at).getTime() < new Date().getTime()) {
                    let series = {
                        name: stockk.name,
                        data: stockk.data,
                        desc: stockk.desc
                    };
                    series_data.push(series);
            }else {
                 makeRequest(stockk.name.toUpperCase()).then((response) => {
                        let series = saveStockReturnSeriesObject(response);
                        series_data.push(series);
                });
            }
            
        });
        websockets.getWss().clients.forEach((client) => {
            client.send(JSON.stringify(series_data));
        });
    }).catch((error) => {
        console.log(error);
        return error;
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



