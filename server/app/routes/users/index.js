'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Favorite = mongoose.model('Favorite');
var Order = mongoose.model('Order');

// Mandrill API to send automatic e-mails
var apiInfo = require("../../../../apiInfo.js");
var mandrillClient = apiInfo.mandrillClient;
var _ = require('lodash');

// Get all users
// GET /api/users
router.get('/', function(req, res, next) {
    User.find({}).exec()
    .then(function(users) {
        res.status(200).json(users);
    }).then(null, next);
});

// Update a user
// PUT /api/users/:userId
router.put('/:userId', function(req, res, next) {
    User.findById(req.params.userId)
        .then(function(user) {
            _.extend(user, req.body);
            return user.save();
        }).then(function(savedUser) {
            res.status(200).json(savedUser);
        }).then(null, next);
});

// Delete a user
// DELETE /api/users/:userId
router.delete('/:userId', function(req, res, next) {
    User.remove({ _id: req.params.userId })
        .then(function(removedUser) {
            res.status(200).send();
        }).then(null, next);
});

// Get all of one user's favorites
// GET /api/users/:userId/favorites
router.get('/:userId/favorites', function(req, res, next) {
    Favorite.find({ user: req.params.userId }).populate("apartment")
        .then(function(favorites) {
            res.status(200).json(favorites);
        }).then(null, (err) => {
            // The user might not be logged in
            console.error(err);
            res.status(401).send(null);
        });
});

// Create a favorite for a user
// POST /api/users/:userId/favorites
router.post('/:userId/favorites', function(req, res, next) {
    Favorite.findOrCreate(req.body)
    .then(function(favorite) {
            res.status(201).json(favorite);
        }).then(null, next);
});

// NOTE: Not sure if we need this, but here it is, we can wipe it if we don't need it
// Delete a favorite
// DELETE /api/users/:userId/favorites/:favoriteId
router.delete('/:userId/favorites/:favoriteId', function(req, res, next) {
    Favorite.remove({ _id: req.params.favoriteId})
        .then(function(removedFavorite) {
            res.status(200).send();
        }).then(null, next);
});

// Get all of one user's orders
// GET /api/users/:userId/orders
router.get('/:userId/orders', function(req, res, next) {
    Order.find({ buyer: req.params.userId }).populate('apartment buyer')
    .then(function(orders) {
        res.status(200).json(orders);
    }).then(null, next);
});
