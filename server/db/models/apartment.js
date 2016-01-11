var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: {type: String},
    monthlyPrice: {type: Number},
    squareFootage: {}
})
