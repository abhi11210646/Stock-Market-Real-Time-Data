
var qs = require('query-string');
const Promise = require('bluebird');
const Stock = require('mongoose').model('Stock');
const got = require('got');
const base_url = 'https://www.quandl.com/api/v3/datasets/WIKI/', stock_name = '';
module.exports = {

    StockData: (ws, req) => {
        let series_data = [];
        ws.on('message', (msg) => {

            msg = JSON.parse(msg);
            if (msg.action == 'NEW_STOCK') {

                getStock(ws, [msg.stock.toUpperCase()]).then((dataset) => {
                    if (dataset) {
                        let series = {
                            name: dataset.dataset_code.toUpperCase(),
                            data: dataset.data,
                            desc: stockk.desc
                        }
                        series_data.push(series);
                        ws.send(JSON.stringify(series_data));
                        let stock = new Stock({
                            name: dataset.dataset_code.toUpperCase(),
                            desc: dataset.name,
                            data: dataset.data
                        });
                        Stock.find({ name: msg.stock }).then((stockk) => {
                            if (!stockk.length) {
                                stock.save();
                            }
                        });
                    }else {
                        throw new Error('not found');
                    }
                }).catch((error) => {
                    ws.send(JSON.stringify([]));
                });
            } else if (msg.action == 'GET_ALL_STOCK') {
                Stock.find({}, { _id: 0 }).then((stocks) => {
                    stocks.forEach((stockk) => {
                        let series = {
                            name: stockk.name,
                            data: stockk.data,
                            desc: stockk.desc
                        }
                        series_data.push(series);
                    });
                    ws.send(JSON.stringify(series_data));
                }).catch((error) => {
                    console.log(error);
                    return error;
                });
            } else {
                if (msg.action == 'DELETE') {
                    Stock.remove({ name: msg.stock.toUpperCase() }).exec();
                }
            }
        });
    }


}

function getStock(ws, stock) {
    let date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
    let gotd;
    let OPTIONS = {
        'column_index': 4,
        'start_date': `${year - 1}-${month}-${day}`,
        'end_date': `${year}-${month}-${day}`,
        'api_key': process.env.api_key
    };
    this.stock_name = `${stock}.json?`;
    return got(base_url + this.stock_name + qs.stringify(OPTIONS)).then(
        (response) => {
            let dataset = JSON.parse(response.body).dataset,
                data = parseTheData(dataset.data);
            dataset.data = data;
            return dataset;
        }
    ).catch(
        (error) => {
            console.log('got error-->>',error);
            return error;
        }
        );
}
function parseTheData(dataset) {
    return dataset.map((stock) => {
        stock[0] = new Date(stock[0]).getTime();
        return stock;
    });
}
