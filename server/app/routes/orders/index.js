'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Order = mongoose.model('Order');

// get all orders
// GET /api/orders
router.get('/', function(req, res, next) {
    Order.find({}).populate('apartment buyer')
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
        res.status(201).json(order)
    }).then(null, next);
});

// Delete an order
// DELETE /api/orders/:orderId
router.delete('/:orderId', function(req, res, next) {
    Order.remove({ _id: req.params.orderId})
        .then(function(removedOrder) {
            res.status(200).send();
        }).then(null, next);
});
