var qs = require('query-string');
const Stock = require('mongoose').model('Stock');
const got = require('got');
const base_url = 'https://www.quandl.com/api/v3/datasets/WIKI/', url = '';
module.exports = {

    StockData: (ws, req) => {
        ws.on('message', (msg) => {
            console.log('msg--->>', msg);
            if(msg == 'NEW_STOCK') {
                console.log('msg', msg);
                saveStock(ws);
            }

        });
    }


}

function saveStock(ws) {
    let date = new Date(), year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
            this.url = 'FB.json?';
            let OPTIONS = {
                'column_index': 4,
                'start_date': `${year - 1}-${month}-${day}`,
                'end_date': `${year}-${month}-${day}`,
                'api_key': process.env.api_key
            };
            got(base_url + this.url + qs.stringify(OPTIONS)).then(
                (response) => {
                    let dataset = JSON.parse(response.body).dataset,
                        data = parseTheData(dataset.data);
                    let stock = new Stock({
                        name: dataset.dataset_code,
                        desc: dataset.name,
                        data: data,
                        start_date: dataset.start_date,
                        end_date: dataset.end_date
                    });
                    stock.save().then((response) => {
                        let series = {
                        name: response.name,
                        data: response.data
                    }
                    ws.send(JSON.stringify(series));
                    }).catch((error) => {
                        console.log(error);
                    });
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
