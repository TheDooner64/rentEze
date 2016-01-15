'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({
    aptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Favorite', schema);
