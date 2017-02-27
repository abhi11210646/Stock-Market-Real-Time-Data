var path = require("path");
require("dotenv").config();
require('./db')();
require('./model/stock');
var stockcontroller = require('./controllers/stockController');
var bodyparser = require('body-parser');
var express = require("express");
var app = express();
app.use(bodyparser.json());
var websockets = require('express-ws')(app);
app.ws('/api',stockcontroller.StockData);
app.use(express.static(path.join(__dirname,'client','dist')));
app.listen(process.env.PORT,()=>{
    console.log("process listening on PORT", process.env.PORT);
});