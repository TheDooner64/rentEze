'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Apartment = mongoose.model('Apartment');
var _ = require('lodash');

// Retrieving all available apartments
// GET /api/apartments
router.get('/', function(req, res, next) {
    Apartment.find({}).then(function(apartments) {
            res.status(200).json(apartments);
        }).then(null, function(err) {
            err.message = "Something went wrong when finding apartments!";
            next(err);
        });
});

// Get a single apartment by ID
// get /api/apartments/:aptId
router.get("/:aptId", function(req, res, next) {

    Apartment.findById(req.params.aptId)
        .then(function(apartment) {
            apartment.averageRating()
                .then(function(rating) {
                    apartment = apartment.toJSON();
                    apartment.rating = rating;
                    res.status(200).json(apartment);
                }).then(null, function(err) {
                    err.message = "Apartment was not successfully found";
                    next(err);
                });

        }).then(null, function(err) {
            err.message = "Apartment was not successfully found";
            next(err);
        });
});

// Retrieving apartments based on criteria, which are sent in the req.body
// POST /api/apartments/filter
router.post('/filter', function(req, res, next) {

    var filterCriteria = req.body;

    Apartment.find(filterCriteria)
        .then(function(apartments) {
            res.status(200).json(apartments);
        }).then(null, function(err) {
            err.message = "Something went wrong when filtering apartments!";
            next(err);
        });
});

// Adding a new apartment
// POST /api/apartments/
router.post('/', function(req, res, next) {
    console.log("Heres the req.body");
    console.log(req.body);
    Apartment.create(req.body)
        .then(function(apartment) {
            res.status(201).json(apartment);
        }).then(null, function(err) {
            err.message = "Apartment was not created!";
            next(err);
        });
});

// Updating an apartment
// PUT /api/apartments/:aptId
router.put('/:aptId', function(req, res, next) {
    Apartment.findById(req.params.aptId)
        .then(function(apartment) {
            _.extend(apartment, req.body);
            return apartment.save();
        }).then(function(savedApt) {
            res.status(200).json(savedApt);
        }).then(null, function(err) {
            err.message = "Apartment was not successfully saved";
            next(err);
        });
});

// Deleting an apartment
// DELETE /api/apartments/:aptId
router.delete('/:aptId', function(req, res, next) {
    Apartment.remove({ _id: req.params.aptId })
        .then(function(removedApartment) {
            res.status(201).send();
        }).then(null, function(err) {
            err.message = "Apartment was not deleted!";
            next(err);
        });
});
