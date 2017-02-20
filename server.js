var path = require("path");
require("dotenv").config();
var express = require("express");
var app = express();
app.use(express.static(path.join(__dirname,'client','dist')));
app.listen(process.env.PORT,()=>{
    console.log("process listening on PORT", process.env.PORT);
});