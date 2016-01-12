'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    aptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment'
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewTitle: {
        type: String
    },
    reviewContent: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Review', schema);
