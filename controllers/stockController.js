

module.exports = {

StockData: (ws, req) => {
    ws.on('message', (msg)=>{


        this.url = 'https://www.quandl.com/api/v3/datasets/WIKI/FB.json?column_index=4&start_date=2014-01-01&end_date=2016-12-31&api_key=-8YKHbxdCgW232Jia8GP';


       let data  = {
            name: 'hUM',
            data: [10, 20, 30, 40, 50, 60, 70]
        }
        ws.send(JSON.stringify(data));
    });
}

    
}