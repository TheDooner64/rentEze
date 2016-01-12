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
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    isSold: {
        type: Boolean,
        required: true
    },
    priceAtTimeOfSale: {
        type: Number
    },
    dateSaved: {
        type: Date
    },
    dateSold: {
        type: Date
    }
});

mongoose.model('Order', schema);
