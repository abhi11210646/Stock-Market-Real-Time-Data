var qs = require('query-string');
const Stock = require('mongoose').model('Stock');
const got = require('got');
const base_url = 'https://www.quandl.com/api/v3/datasets/WIKI/', stock_name = '';
var series_data = [];
module.exports = {

    StockData: (ws, req) => {
        ws.on('message', (msg) => {
            if (msg == 'NEW_STOCK') {
                saveStock(ws, [stock.toUpperCase()]).then((series_data) => {
                    ws.send(JSON.stringify(series_data));
                });
            } else if (msg == 'GET_ALL_STOCK') {
                Stock.findOne({}, { _id: 0 }).select('name').then((stocks) => {
                    // stocks.forEach((stock) => {
                    saveStock(ws, [stocks.name.toUpperCase()]).then((series_data) => {
                        ws.send(JSON.stringify(series_data));
                    });
                    // });

                }).catch((error) => {
                    console.log(error);
                    return error;
                });
            }

        });
    }


}

function saveStock(ws, stock) {
    console.log("ye jindagi haisafar tu", stock);
    let date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
    this.stock_name = `${stock}.json?`;
    console.log("this.stock_name=====>>",this.stock_name, stock[0]);
    let OPTIONS = {
        'column_index': 4,
        'start_date': `${year - 1}-${month}-${day}`,
        'end_date': `${year}-${month}-${day}`,
        'api_key': process.env.api_key
    };
    return got(base_url + this.stock_name + qs.stringify(OPTIONS)).then(
        (response) => {
            let dataset = JSON.parse(response.body).dataset,
                data = parseTheData(dataset.data);
            dataset.data = data;
            // let stock = new Stock({
            //     name: dataset.dataset_code.toLowerCase(),
            //     desc: dataset.name
            // });
            // console.log(dataset, '--------->>>');
            let series = {
                        name: dataset.dataset_code,
                        data: dataset.data
                    }
                    series_data.push(series);
            return series_data;
            // stock.save().then((response) => {
            //     let series = {
            //         name: response.name,
            //         data: data
            //     }
            //     series_data.push(series);
            //     ws.send(JSON.stringify(series_data));
            // }).catch((error) => {
            //     console.log(error);
            // });
        }
    ).catch(
        (error) => {
            console.log(error);
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
