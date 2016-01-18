'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Order = mongoose.model('Order');

// get all orders
// GET /api/orders
router.get('/', function(req, res, next) {
    Order.find({}).populate('apartment buyer').exec()
    .then(function(orders) {
        res.status(200).json(orders);
    }).then(null, next);
});

// create new order
// POST /api/orders
router.post('/', function(req, res, next) {
    console.log(req.body)
    Order.create(req.body)
    .then(function(order) {
        console.log('I create order: ', order);
        res.status(201).json(order)
    }).then(null, next);
});
