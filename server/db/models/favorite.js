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

schema.statics.findOrCreate = function(favorite) {
    var self = this;

    return this.findOne(favorite)
    .then(function(foundFavorite) {
        if (!foundFavorite) {
            return self.create(favorite);
        } else {
            return foundFavorite;
        }
    })
}

mongoose.model('Favorite', schema);
