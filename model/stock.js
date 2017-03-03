var mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        trim: true,
        unique: true
    },
    data: {
        type: Array,
        trim: true
    },
    desc: {
        type: String,
        trim: true

    }

});

module.exports = mongoose.model('Stock', stockSchema);