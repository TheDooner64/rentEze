'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Review = mongoose.model('Review');

// POST /api/reviews
router.get('/:aptId', function(req, res, next){
    Review.find({apartment:req.params.aptId}).populate('reviewer').exec()
        .then(reviews => {
            res.status(200).json(reviews);
        }).then(null, console.log)
})

router.post('/', function(req, res, next){
    Review.create(req.body)
        .then(review => {
            res.status(201).json(review);
        })
});
