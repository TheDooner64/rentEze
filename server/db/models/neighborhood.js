'use strict';
var mongoose = require('mongoose');
var Chance = require('chance');
var chance = new Chance();
var rp = require('request-promise');
var apiKey = require('../../../apiInfo.js').maps;

var latLongSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    latLong: {
        type: latLongSchema
    }
});

schema.pre('save', function(next){
    var hood = this;
    if (hood.latLong) next();
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=new%20york%22&components=locality:" + hood.name.replace(" ", "%20") + "&key=" + apiKey;
    rp(url)
        .then(function(res){
            var info = JSON.parse(res);
            if (info.results.length < 1) next();
            hood.latLong = info.results[0].geometry.location;
            next();
        }).then(null, console.log)
})

schema.statics.findOrCreateByName = function (name) {
    var Neighborhood = this;
    return Neighborhood.findOne({name:name}).exec()
    .then(function(found){
        if (found) return found;
        var newHood = new Neighborhood({
            name:name,
            description: chance.paragraph()
        });
        return newHood.save()
        .then(function(newHood){
            return newHood;
        })
        .then(null, console.log)

    })
}

mongoose.model('Neighborhood', schema);
