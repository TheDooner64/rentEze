'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Favorite', schema);
