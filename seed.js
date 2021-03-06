/*
This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.
It uses the same file the server uses to establish
the database connection:
--- server/db/index.js
The name of the database used is set in your environment files:
--- server/env/*
This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.
*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var Chance = require('chance');
var chance = new Chance();
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Apartment = Promise.promisifyAll(mongoose.model('Apartment'));
var Review = Promise.promisifyAll(mongoose.model('Review'));
var apiKey = require('./apiInfo.js').maps;
var rp = require('request-promise');
var _ = require('lodash');
var numApts = 80;
var numUsers = 5;
var numReviews = 10;
var userIds;
var aptIds;

var lat = [40.71, 40.75];
var lon = [-74, -73.98];

var randApt = function() {

    var randLat = chance.latitude({
        min: lat[0],
        max: lat[1]
    });

    var randLon = chance.longitude({
        min: lon[0],
        max: lon[1]
    });

    var latLong = randLat + ',' + randLon;

    var termOfLease = ["1 month", "3 months", "3 months", "3 months", "6 months", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "1 year", "2 years"];
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latLong + '&key=' + apiKey;
    var availability = ["available", "available", "available", "available", "available", "available", "unavailable", "pending"];
    var pictureUrls = require("./seedInfo/imageurls.js").imageUrls;

    return rp(url)
        .then(function(res) {
            var info = JSON.parse(res);
            if (info.results.length < 1) return;
            var addressComponents = info.results[0].address_components;
            var numBed = chance.integer({
                min: 0,
                max: 4
            });

            var adjectives = ["Suspicious", "Luxurious", "Ludacris", "Spacious", "Sexy", "Ambigious",
            "Nautical", "Outrageously Priced", "Smelly", "Quaint", "Cozy", "Dynamic", "Responsive",
            "Asynchronous", "Weird", "Magical", "Wonky", "Hacky", "Perfect for Cats", "Existential",
            "Holographic", "Possibly Real", "Comfortable", "Flex-Box", "RESTful", "Rat Infested", "Roach Infested",
            "Dilapidated", "Toasted w/ Cream Cheese"]

            var city = addressComponents.filter(function(component) {
                return component.types.indexOf('locality') > -1 || component.types.indexOf('sublocality') > -1
            })[0];

            var state = addressComponents.filter(function(component) {
                return component.types.indexOf('administrative_area_level_1') > -1
            })[0];

            var zip = addressComponents.filter(function(component) {
                return component.types.indexOf('postal_code') > -1
            })[0];

            var neighborhood = addressComponents.filter(function(component) {
                return component.types.indexOf('neighborhood') > -1
            })[0];
            console.log(neighborhood, latLong)
            var apt = {
                streetAddress: addressComponents[0].long_name + ' ' + addressComponents[1].long_name,
                city: city.long_name,
                state: state.long_name,
                zipCode: zip.long_name,
                title: numBed + "  Bed" + " " + adjectives[chance.integer({
                    min: 0,
                    max: adjectives.length - 1
                })] + ' Apartment',
                monthlyPrice: chance.integer({
                    min: 600,
                    max: 5000
                }),
                squareFootage: chance.integer({
                    min: 350,
                    max: 3000
                }),
                numBedrooms: numBed,
                numBathrooms: chance.integer({
                    min: 1,
                    max: 3
                }),
                description: chance.paragraph(),
                pictureUrls: [pictureUrls[chance.integer({
                    min: 0,
                    max: pictureUrls.length - 1
                })], pictureUrls[chance.integer({
                    min: 0,
                    max: pictureUrls.length - 1
                })]],
                termOfLease: termOfLease[chance.integer({
                    min: 0,
                    max: termOfLease.length - 1
                })],
                availability: availability[chance.integer({
                    min: 0,
                    max: availability.length - 1
                })]
            };
            if (neighborhood && neighborhood.long_name) {
                apt.neighborhoodString = neighborhood.long_name;
            }
            return apt;
        });
};

var seedApartments = function() {
    var aptPromises = _.times(numApts, randApt)
    return Promise.map(aptPromises, function(apartment){
        return Apartment.createAsync(apartment)
    }, {concurrency: 1})
    .then(null, console.log)
}

var emails = chance.unique(chance.email, numUsers);
var randUser = function() {
    var name = chance.name().split(' ')
    return {
        firstName: chance.first(),
        lastName: chance.last(),
        email: emails.pop(),
        classification: 'tenant',
        isAdmin: false,
        password: chance.word()
    };
}

var seedUsers = function() {
    var users = _.times(numUsers, randUser)
    users.push({
        email: 'testing@fsa.com',
        password: 'password',
        firstName: "Full",
        lastName: "Stack",
        isAdmin: true,
        classification: 'tenant'
    });
    users.push({
        email: 'donald@trump.com',
        password: 'america',
        firstName: "Donald",
        lastName: "Trump",
        isAdmin: true,
        classification: 'landlord'
    });

    return User.createAsync(users);

};

var randReview = function() {
    return {
        title: chance.sentence({
            words: 4
        }),
        content: chance.paragraph(),
        rating: chance.integer({
            min: 1,
            max: 5
        }),
        apartment: aptIds[chance.integer({
            min: 0,
            max: aptIds.length - 1
        })],
        reviewer: userIds[chance.integer({
            min: 0,
            max: userIds.length - 1
        })],
    }
}

var seedReviews = function() {
    return Review.createAsync(_.times(numReviews, randReview));
}

connectToDb.then(function() {

    seedUsers()
        .then(function(createdUsers) {
            userIds = createdUsers.map(function(user) {
                return user._id
            });
            return seedApartments() //here we create the apartments
        }).then(function(createdApartments) {
            aptIds = createdApartments.map(function(apt) {
                return apt._id
            });
            return seedReviews()
        })
        .then(function() {
            console.log(chalk.green('Seed successful!'));
            process.kill(0);
        }).catch(function(err) {
            console.error(err);
            process.kill(1);
        });
});
