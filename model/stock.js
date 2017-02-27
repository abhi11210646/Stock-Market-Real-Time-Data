var mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    data: {
        type: Array
    }
});

module.exports = mongoose.model('Stock', stockSchema);