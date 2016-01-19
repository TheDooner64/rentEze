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

// fs and ejs to create email template
var fs = require("fs");
var ejs = require("ejs");

// Route to send an e-mail confirmation
// GET /api/users/:userId/mailer
router.post('/:userId/mailer', function(req, res, next) {

    Order.findById(req.body._id).populate('apartment buyer')
        .then(function(order) {
            fs.readFile(__dirname + "/../../views/email-template.ejs", "utf8", function(err, data) {
                if (err) next(err);
                var emailTemplate = data;
                var customizedTemplate = ejs.render(emailTemplate, {
                    firstName: order.buyer.firstName,
                    email: order.buyer.email,
                    apartment: order.apartment.title,
                    price: order.priceAtTimeOfSale,
                    dateSold: order.dateSold
                });
                var message = {
                    "html": customizedTemplate,
                    "subject": "RentEze apartment application confirmation",
                    "from_email": "Robert.Muldoon.1@gmail.com",
                    "from_name": "RentEze team",
                    "to": [{
                        "email": order.buyer.email,
                        "name": order.buyer.firstName
                    }],
                    "important": false,
                    "track_opens": true,
                    "auto_html": false,
                    "preserve_recipients": true,
                    "merge": false,
                    "tags": [
                        "RentEze"
                    ]
                };

                var async = false;
                var ip_pool = "Main Pool";

                mandrillClient.messages.send({
                    "message": message,
                    "async": async,
                    "ip_pool": ip_pool
                }, function(result) {
                    console.log("Result from mailer: ", result);
                    res.status(201).send(result);
                }, function(err) {
                    // Mandrill returns the error as an object with name and message keys
                    console.log('A mandrill error occurred: ' + err.name + ' - ' + err.message);
                    next(err);
                });

            });
        });
});

// Get all of one user's favorites
// GET /api/users/:userId/favorites
router.get('/:userId/favorites', function(req, res, next) {
    Favorite.find({
            user: req.params.userId
        }).populate("apartment")
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

// Delete a favorite
// DELETE /api/users/:userId/favorites/:favoriteId
router.delete('/:userId/favorites/:favoriteId', function(req, res, next) {
    Favorite.remove({
            _id: req.params.favoriteId
        })
        .then(function(removedFavorite) {
            res.status(200).send();
        }).then(null, next);
});

// Get all of one user's orders
// GET /api/users/:userId/orders
router.get('/:userId/orders', function(req, res, next) {
    Order.find({
            buyer: req.params.userId
        }).populate('apartment buyer')
        .then(function(orders) {
            res.status(200).json(orders);
        }).then(null, next);
});
