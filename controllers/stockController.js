var qs = require('query-string');
const Stock = require('mongoose').model('Stock');
const got = require('got');
const base_url = 'https://www.quandl.com/api/v3/datasets/WIKI/', url = '';
module.exports = {

    StockData: (ws, req) => {
        ws.on('message', (msg) => {
            let year = new Date().getFullYear();
            this.url = 'FB.json?';
            let OPTIONS = {
                    'column_index': 4,
                    'start_date': `${year-1}-01-01`,
                    'end_date': `${year}-01-01`,
                    'api_key': process.env.api_key
                };
            got(base_url + this.url + qs.stringify(OPTIONS)).then(
                (response) => {
                    console.log('rersponse--==>>', JSON.parse(response.body).dataset);
                }
            ).catch(
                (error) => {
                    console.log('error-->', error);
                }
                );
            // ws.send(JSON.stringify(data));
        });
    }


}