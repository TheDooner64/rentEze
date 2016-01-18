'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Favorite = mongoose.model('Favorite');

// router.param('/:userId', function(req, res, next, id) {
//     User.findOne(id).exec()
//         .then(function(user) {
//             console.log("Getting to the router.param, here's the user…");
//             console.log(user);
//             req.user = user;
//             next();
//         }).then(null, next);
// });

// Get all of one user's favorites
// GET /api/users/:userId/favorites/
router.get('/:userId/favorites', function(req, res, next) {
    Favorite.find({ user: req.params.userId }).populate("apartment")
        .then(function(favorites) {
            console.log("here are the user's favorites…")
            console.log(favorites);
            res.status(200).json(favorites);
        }).then(null, (err) => {
            // The user might not be logged in
            console.error(err);
            res.status(401).send(null);
        });
});

// Create a favorite for a user
// POST /api/users/:userId/favorites/
router.post('/:userId/favorites', function(req, res, next) {
    Favorite.create(req.body)
        .then(function(favorite) {
            console.log("here is the favorite you added…")
            console.log(favorite);
            res.status(201).json(favorite);
        }).then(null, next);
});

// NOTE: Not sure if we need this, but here it is, we can wipe it if we don't need it
// Delete a favorite
// DELETE /api/users/:userId/favorites/:favoriteId
router.delete('/:userId/favorites/:favoriteId', function(req, res, next) {
    Favorite.remove({ _id: req.params.favoriteId})
        .then(function(removedFavorite) {
            console.log("Favorite removed…");
            console.log(removedFavorite);
            res.status(200).send();
        }).then(null, next);
});
