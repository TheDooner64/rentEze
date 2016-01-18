var mongoose = require('mongoose');
var Review = mongoose.model('Review');
var Neighborhood = mongoose.model('Neighborhood');
var rp = require('request-promise');

var latLongSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});

var apiKey = require('../../../apiInfo.js').maps;
var schema = new mongoose.Schema({
    title: {
        type: String
    },
    monthlyPrice: {
        type: Number
    },
    squareFootage: {
        type: Number
    },
    streetAddress: {
        type: String
    },
    aptNum: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
    latLong: {
        type: latLongSchema
    },
    landlord: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    neighborhood: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Neighborhood'
    }, //TODO we expect to remove the neighborhood model
    numBedrooms: {
        type: Number
    },
    numBathrooms: {
        type: Number
    },
    description: {
        type: String
    },
    pictureUrls: [{
        type: String
    }],
    termOfLease: {
        type: String
    },
    availability: {
        type: String
    },
    neighborhoodString :{
        type: String
    }
    // },
    // toObject: {
    //     virtuals: true
    // },
    // toJSON: {
    //     virtuals: true
    // }

    //name it "Apartment"
    // user schema is "User"
    //create ppsf static, lat/long static, isRentable static

});

//nearly all this virtual logic may make more sense on the front end
//virtual to represent price per squarefoot
schema.virtuals.ppsf = function() {
    var apartment = this;
    return apartment.monthlyPrice / apartment.squareFootage;
}

schema.pre('save', function(next) {
    var apartment = this;
    var addressString = apartment.streetAddress + " " + apartment.city + " " + apartment.state + " " + apartment.zipCode;
    //be on look out for other "special character issues besides space character"
    var queryAddress = addressString.replace(" ", "%20");
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + queryAddress + "&sensor=false&key=" + apiKey;
    rp(url)
        .then(function(res) {
            var info = JSON.parse(res);
            if (info.results.length < 1) next();
            apartment.latLong = info.results[0].geometry.location;
            next();
        }).then(null, console.log)

});

schema.pre('validate', function(next){
    var apartment = this;
    console.log(apartment)
    if (!apartment.neighborhoodString) next();
    Neighborhood.findOrCreate({name:apartment.neighborhoodString})
        .then(function(neighborhood){
            apartment.neighborhood = neighborhood._id;
            next();
        }).then(null, console.log);
})

// NOTE: Need to change averageRating to a method
schema.methods.averageRating = function() {
    var apartment = this;
    return Review.find({
            aptId: apartment._id
        }).exec()
        .then(function(reviews) {
            if (reviews.length === 0) return null;
            var total = reviews.reduce(function(a, b) {
                return a + b.rating;
            }, 0);
            return total / reviews.length;
        }).then(null, console.log);
}

mongoose.model('Apartment', schema);
