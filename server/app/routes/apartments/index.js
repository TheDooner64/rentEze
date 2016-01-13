'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Apartment = mongoose.model('Apartment');

// Retrieving apartments based on criteria, which are sent in the req.body
// POST /api/apartments/filter

router.get('/', function(req, res, next){
    Apartment.find({availability:"available"}).exec().
    then(function(apartments){
        res.json(apartments);
    }).then(null, function(err){
        throw new Error("Something went wrong when finding apartments!");
        next(err);
    })
})

router.post('/filter', function(req, res, next) {

    var rawFilterCriteria = req.body;

    // Create MongoDB search object
    // Need to figure out how to populate averageRating virtual field
    var cleanFilterCriteria = {
        numBedrooms: rawFilterCriteria.numBedrooms.val,
        monthlyPrice: {
            $gt: parseInt(rawFilterCriteria.monthlyPriceMin),
            $lt: parseInt(rawFilterCriteria.monthlyPriceMax)
        },
        // averageRating: rawFilterCriteria.averageRating,
        termOfLease: rawFilterCriteria.termOfLease
    };

    Apartment.find(cleanFilterCriteria)
        .then(function(apartments) {
            console.log("Apt found in DB: ", apartments);
            res.status(200).json(apartments);
        }).then(null, function(err) {
            throw new Error("Something went wrong when finding apartments!");
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
    Apartment.findOne({
            _id: req.params.aptId
        }).exec()
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
