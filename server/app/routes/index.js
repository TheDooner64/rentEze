'use strict';
var router = require('express').Router();
module.exports = router;

// /api/users
router.use('/users', require('./users'));

// /api/apartments
router.use('/apartments', require('./apartments'));

// /api/reviews
router.use('/reviews', require('./reviews'));

// /api/orders
router.use('/orders', require('./orders'));

// /api/neighborhoods
router.use('/neighborhoods', require('./neighborhoods'))

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
