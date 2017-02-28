var mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        trim: true
    },
    desc: {
        type: String,
        trim: true
        
    }

});

module.exports = mongoose.model('Stock', stockSchema);