'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    priceAtTimeOfSale: {
        type: Number
    },
    dateSold: {
        type: Date
    },
    status:{
        type: String
    }
});

mongoose.model('Order', schema);
