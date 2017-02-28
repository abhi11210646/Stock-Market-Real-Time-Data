var mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    desc: {
        type: String,
        trim: true
    },
    data: {
        type: Array
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    }
});

module.exports = mongoose.model('Stock', stockSchema);