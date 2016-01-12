'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Apartment = mongoose.model('Apartment');
var bodyParser = require('body-parser');
// May or may not need to configure body-parser here...

// Getting One apartment
// GET /api/apartments/:aptId
router.get('/:aptId', function(req, res, next) {
    Apartment.findOne({ _id: req.params.aptId }).exec()
        .then(function(apartment) {
            res.json(apartment);
        }).then(null, function(err) {
            throw new Error("This apartment doesn't exist!");
            next(err);
        });
});

// Adding a new apartment
// POST /api/apartments/
router.post('/', function(req, res, next) {
    Apartment.create(req.body)
        .then(function(apartment) {
            res.json(apartment);
        }).then(null, function(err) {
            throw new Error("Apartment was not created!");
            next(err);
        });
});

// Updating an apartment
// PUT /api/apartments/:aptId
router.put('/:aptId', function(req, res, next) {
    Apartment.findOne({ _id: req.params.aptId }).exec()
        .then(function(apartment) {
            // req.body needs to be the entire apartment object
            apartment = req.body;
            return apartment.save();
        }).then(function(savedApt) {
            res.json(savedApt);
        }).then(null, function(err) {
            throw new Error("Apartment was not successfully saved :(");
            next(err);
        });
});

// Getting apartments by Neighborhood
// GET /api/apartments/neighborhood/:neighborhoodId
router.get('/neighborhood/:neighborhoodId', function(req, res, next){
    // I don't know if the below will work because I'm not sure if
    Apartment.find({ neighborhood: req.params.neighborhoodId }).exec()
        .then(function(neighborhood) {
            res.json(neighborhood);
        }).then(null, function(err) {
            throw new Error("Could not find apartments by neighborhood ID!");
            next(err);
        });
});
