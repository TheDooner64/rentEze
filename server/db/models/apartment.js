var mongoose = require('mongoose');
var Review = mongoose.model('Review')
var schema = new mongoose.Schema({
    title: {type: String},
    monthlyPrice: {type: Number},
    squareFootage: {type: Number},
    streetAddress: {type: String},
    aptNum: {type: String},
    city: {type: String},
    state: {type: String},
    zipCode: {type: Number},
    landlord: {type: mongoose.Schema.ObjectId, ref: "User"},
    neighborhood: {type: mongoose.Schema.ObjectId, ref: "Neighborhood"},
    numBedrooms: {type: Number},
    numBathrooms: {type: Number},
    description: {type: String},
    pictureUrl: [{type:String}],
    termOfLease: {type:String},
    availability: {type:String}



    //name it "Apartment"
    // user schema is "User"
    //create ppsf static, lat/long static, isRentable static

})

//virtual to represent price per squarefoot
schema.virtuals.ppsf = function () {
    var apartment = this;
    return apartment.monthlyPrice/apartment.squareFootage;
}

schema.virtuals.latLong = function (){
}

//
schema.virtuals.averageRating = function (){
    var apartment = this;
    Review.find(aptId:apartment._id).exec()
        .then(function(reviews){
            var total = reviews.reduce(function(a,b){
                return a+b.rating;
            },0)gi
            return total/reviews.length;
        }).then(null, console.log)
}

mongoose.model('Apartment', schema)
