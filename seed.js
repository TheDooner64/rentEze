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
var chance = require('chance');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Apartment = Promise.promisifyAll(mongoose.model('Apartment'));
var apiKey = require('./apiInfo.js').maps;
var rp = require('request-promise');

var numApts = 20;
var numUsers = 20;

var lat = [40.71, 40.75];
var lon = [-74, -73.98];

var randApt = function() {
    var randLat = chance.latitude({ min: lat[0], max: lat[1] });
    var randLon = chance.longitude({ min: lon[0], max: lon[1] });
    var latLong = randLat + ',' + randLon;

    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latLong + '&key=' + apiKey;

    rp(url)
        .then(function(res) {
            var info = JSON.parse(res);
            var addressComponents = info.results[0].address_components;
            var city = addressComponents.map(function(component) {
                if (component.types.indexOf('locality') > -1 || component.types.indexOf('sublocality') > -1) {
                    return component;
                }
            })[0];
            var state = addressComponents.map(function(component) {
                if (component.types.indexOf('administrative_area_level_1') > -1) {
                    return component;
                }
            })[0];
            var zip = addressComponents.map(function(component) {
                if (component.types.indexOf('postal_code') > -1) {
                    return component;
                }
            })[0];
            return new Apartment({
                streetAddress: addressComponents[0].long_name + ' ' + addressComponents[1].long_name,
                city: city,
                state: state,
                zipCode: zip,
                neighborhood: addressComponents[].long_name,
                title: adj + ' ' + numBed + ' Bedroom Apartment',
                monthlyPrice:,
                squareFootage:,
                numBedrooms:,
                numBathrooms:,
                description:,
                pictureUrls:,
                termOfLease:,
                availability:
            });
        });
};


var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

connectToDb.then(function () {
    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
