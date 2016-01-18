'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Neighboorhood = mongoose.model('Neighborhood');

router.get('/', function (req, res, next) {
    Neighboorhood.find({}).exec()
        .then(function(neighboorhoods){
            res.status(200).json(neighboorhoods)
        }).then(null, function(err){
            err.message = "Something went wrong when finding apartments!";
            next(err);
        })
})
