'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Review = mongoose.model('Review');

// POST /api/reviews
router.post('/', function(req, res, next){
    Review.create(req.body)
        .then(review => {
            res.status(201).json(review);
        })
});
