'use strict';
var router = require('express').Router();
module.exports = router;

// /api/members
router.use('/members', require('./members'));

// /api/users
router.use('/users', require('./users'));

// /api/members
router.use('/apartments', require('./apartments'));

// /api/reviews
router.use('/reviews', require('./reviews'));

// /api/reviews
router.use('/favorites', require('./favorites'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
