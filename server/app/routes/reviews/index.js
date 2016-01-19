'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Review = mongoose.model('Review');

// Get all reviews for a single apartment
// GET /api/reviews/:aptId
router.get('/:aptId', function(req, res, next){
    Review.find({apartment:req.params.aptId}).populate('reviewer').exec()
        .then(reviews => {
            res.status(200).json(reviews);
        }).then(null, console.log)
})

// Add a new review
// POST /api/reviews
router.post('/', function(req, res, next) {
    Review.create(req.body)
        .then(review => {
            res.status(201).json(review);
        })
});
