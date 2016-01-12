'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pictureUrls: [{
        type: String
    }],
    averagePriceOfApts: {
        type: Number
    },
    description: {
        type: String
    }
});

mongoose.model('Neighborhood', schema);
