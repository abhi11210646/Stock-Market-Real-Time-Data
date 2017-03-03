var mongoose = require('mongoose');
module.exports = () => {
     var options = {socketOptions : { keepAlive: 1200 }};
    mongoose.connect(process.env.DB_test, options, (err)=>{
        if(err) { throw err;}
    });
   
    mongoose.connection.on('connected', ()=>{
        console.log('Database Connection Establised');
    });
    mongoose.connection.on('error', (err)=>{
        console.log('Database Connection error',err);
    });

};