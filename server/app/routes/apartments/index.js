'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Apartment = mongoose.model('Apartment');

// Retrieving apartments based on criteria, which are sent in the req.body
// POST /api/apartments/filter
router.get('/neighborhoods', function(req, res, next){
    var neighborhoods={};
    Apartment.find({}).exec()
        .then(function(apartments){
            apartments.forEach(function(apartment){
                if (!neighborhoods[apartment.neighborhood]) neighborhoods[apartment.neighborhood] = apartment.neighborhood
            })
        var neighborhoodArray = Object.keys(neighborhoods).map(function(key){
                return neighborhoods[key]
            })
            res.status(200).json(neighborhoodArray)
        })
})

router.get('/', function(req, res, next){
    Apartment.find({availability:"available"}).exec()
        .then(function(apartments){
            res.json(apartments);
        }).then(null, function(err){
            err.message = "Something went wrong when finding apartments!";
            next(err);
        })
})

router.post('/filter', function(req, res, next) {

    var rawFilterCriteria = req.body;

    // Create MongoDB search object
    // Need to figure out how to populate averageRating virtual field
    var cleanFilterCriteria = {
        monthlyPrice:{}
    };

    if (rawFilterCriteria.numBedrooms) cleanFilterCriteria.numBedrooms = rawFilterCriteria.numBedrooms.val;
    if (rawFilterCriteria.monthlyPriceMin) cleanFilterCriteria.monthlyPrice.$gt = parseInt(rawFilterCriteria.monthlyPriceMin);
    if (rawFilterCriteria.monthlyPriceMax) cleanFilterCriteria.monthlyPrice.$lt = parseInt(rawFilterCriteria.monthlyPriceMax);
    if (rawFilterCriteria.termOfLease) cleanFilterCriteria.termOfLease = rawFilterCriteria.termOfLease;
    console.log(cleanFilterCriteria)
    Apartment.find(cleanFilterCriteria)
        .then(function(apartments) {
            console.log("Apt found in DB: ", apartments);
            res.status(200).json(apartments);
        }).then(null, function(err) {
            err.message = "Something went wrong when filtering apartments!";
            next(err);
        });
});

// Adding a new apartment
// POST /api/apartments/
router.post('/', function(req, res, next) {
    Apartment.create(req.body)
        .then(function(apartment) {
            res.status(201).json(apartment);
        }).then(null, function(err) {
            err.message = "Apartment was not created!";
            next(err);
        });
});

router.get("/:aptId", function(req, res, next){
    Apartment.findOne({
        _id: req.params.aptId
    }).exec()
    .then(function(apartment){
        res.status(200).json(apartment);
    }).then(null, function(err) {
            err.message = "Apartment was not successfully found";
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
            res.status(200).json(savedApt);
        }).then(null, function(err) {
            err.message = "Apartment was not successfully saved";
            next(err);
        });
});
