'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({
    aptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    priceAtTimeOfSale: {
        type: Number
    },
    dateSold: {
        type: Date
    }
});

mongoose.model('Order', schema);
