// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Apartment = mongoose.model('Apartment');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Apartment routes', function() {

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    describe('Get apartments from the database', function() {
        var loggedInAgent;

        var userInfo = {
            email: 'joe@gmail.com',
            password: 'shoopdawoop',
            admin: true
        };

        var sampleApartments = [{
            title: 'Smelly apartment',
            monthlyPrice: 3000,
            squareFootage: 1000,
            streetAddress: '100 E 10th St',
            aptNum: '1021',
            city: 'New York',
            state: 'NY',
            zipCode: '10010',
            numBedrooms: 1,
            numBathrooms: 1,
            description: 'This is a really great apartment!',
            pictureUrls: [
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1682956/0000_1963481181_large.jpg',
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1683913/0000_565564171_large.jpg'
            ],
            termOfLease: '1 year',
            availability: 'available',
            neighborhoodString: 'East Village',
            latLong: {
                lat: 40.7447696,
                lng: -73.9899308
            },
            landlord: '569d2fff31bface72f9f4781',
            neighborhood: '569d2fff31bface72f9f4782'
        },
        {
            title: 'Awesome apartment',
            monthlyPrice: 2000,
            squareFootage: 500,
            streetAddress: '15 W 83rd St',
            aptNum: '34D',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '55555',
            numBedrooms: 3,
            numBathrooms: 2,
            description: 'This apartment is available and nice!',
            pictureUrls: [
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1682956/0000_1963481181_large.jpg',
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1683913/0000_565564171_large.jpg',
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1683913/0000_565564171_large.jpg'
            ],
            termOfLease: '3 months',
            availability: 'available',
            neighborhoodString: 'Dumbo',
            latLong: {
                lat: 40.7447696,
                lng: -73.9899308
            },
            landlord: '569d2fff31bface72f9f4783',
            neighborhood: '569d2fff31bface72f9f4784'
        }];

        beforeEach('Create a user', function(done) {
            User.create(userInfo, done);
        });

        // Store ID so I can make changes with POST and PUT requests
        var sampleId;

        beforeEach('Create apartments', function(done) {
            Apartment.create(sampleApartments)
            .then(function(apartments) {
                sampleId = apartments[0]._id;
                done();
            }).then(null, done);
        });

        beforeEach('Create loggedIn user agent and authenticate', function(done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo).end(done);
        });

        it('can find all apartments', function(done) {
            loggedInAgent.get('/api/apartments').expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.equal(2);
                done();
            });
        });

        it('can find a single apartment by id', function(done) {
            loggedInAgent.get('/api/apartments/' + sampleId).expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body.monthlyPrice).to.equal(3000);
                expect(response.body.pictureUrls.length).to.equal(2);
                done();
            });
        });

        it('can find apartments based on filtering numBedrooms', function(done) {
            var filteredCriteria = { numBedrooms: 1 };

            loggedInAgent.post('/api/apartments/filter').send(filteredCriteria).expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.equal(1);
                expect(response.body[0].monthlyPrice).to.equal(3000);
                expect(response.body[0].pictureUrls.length).to.equal(2);
                done();
            });
        });

        it('can find apartments based on filtering termOfLease', function(done) {
            var filteredCriteria = { termOfLease: '1 year' };

            loggedInAgent.post('/api/apartments/filter').send(filteredCriteria).expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.equal(1);
                expect(response.body[0].monthlyPrice).to.equal(3000);
                expect(response.body[0].pictureUrls.length).to.equal(2);
                done();
            });
        });

        it('can find apartments based on filtering availability', function(done) {
            var filteredCriteria = { availability: 'available' };

            loggedInAgent.post('/api/apartments/filter').send(filteredCriteria).expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.equal(2);
                done();
            });
        });

        it('can add a new apartment', function(done) {
            var newApartment = {
            title: 'My new apartment',
            monthlyPrice: 1000,
            squareFootage: 300,
            streetAddress: '5th avenue',
            aptNum: '123',
            city: 'Queens',
            state: 'NY',
            zipCode: '22222',
            numBedrooms: 4,
            numBathrooms: 3,
            description: 'This is my new apartment!',
            pictureUrls: [
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1682956/0000_1963481181_large.jpg',
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1683913/0000_565564171_large.jpg',
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1682956/0000_1963481181_large.jpg',
                'http://photonet.hotpads.com/search/listingPhoto/StreetEasy/1683913/0000_565564171_large.jpg'
            ],
            termOfLease: '2 years',
            availability: 'available',
            neighborhoodString: 'Sunnyside',
            latLong: {
                lat: 42.7447696,
                lng: -71.9899308
            },
            landlord: '569d2fff31bface72f9f4781',
            neighborhood: '569d2fff31bface72f9f4782'
        };

            loggedInAgent.post('/api/apartments').send(newApartment).expect(201).end(function(err, response) {
                if (err) return done(err);
                expect(response.body.monthlyPrice).to.equal(1000);
                expect(response.body.city).to.equal('Queens');
                expect(response.body.pictureUrls.length).to.equal(4);
                done();
            });
        });

        it('can update a single apartment', function(done) {
            var changedCriteria = { availability: 'pending' };

            loggedInAgent.put('/api/apartments/' + sampleId).send(changedCriteria).expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body.monthlyPrice).to.equal(3000);
                expect(response.body.pictureUrls.length).to.equal(2);
                expect(response.body.availability).to.equal('pending');
                done();
            });
        });

    });

    // describe('Admin capabilities', function() {

    //     var loggedInAdmin;
    //     var guestAgent;
    //     var adminInfo = {
    //         email: 'joe@gmail.com',
    //         password: 'shoopdawoop',
    //         admin: true
    //     };

    //     beforeEach('Create User', function(done) {
    //         User.create(adminInfo, done);
    //     });

    //     beforeEach('Create loggedIn user agent and authenticate', function(done) {
    //         loggedInAdmin = supertest.agent(app);
    //         loggedInAdmin.post('/login').send(userInfo).end(done);
    //     });

    //     beforeEach('Create guest agent', function() {
    //         guestAgent = supertest.agent(app);
    //     });

    //     xit('can create a new apartment', function(done) {
    //         loggedInAdmin.post('/api/apartments')
    //             .send({
    //                 streetAddress: '5 Hanover Square',
    //                 title: "Fullstack Academy"
    //             })
    //             .expect(201)
    //             .end(function(err, res) {
    //                 if (err) return done(err);
    //                 console.log(res.body)
    //                 expect(res.body).to.be.an('object');
    //                 expect(res.body.title).to.equal("Fullstack Academy");
    //                 done();
    //             });
    //     });
    //     xit('Non admin cannot create a new apartment', function(done) {
    //         guestAgent.post('/api/apartments')
    //             .send({
    //                 streetAddress: '5 Hanover Square',
    //                 title: "Fullstack Academy"
    //             })
    //             .expect(401)
    //             .end(function(err, res) {
    //                 if (err) return done(err);
    //                 done();
    //             });
    //     });
    //     xit('can update apartment', function() {
    //         // loggedInAdmin.put('/api/apartments/' + aptId)
    //         //     .expect(200)
    //         //     .end(function(err, res) {
    //         //         if (err) return done(err);
    //         //         done();
    //         //     });
    //     });
    //     xit('Non admin cannot update apartment', function() {
    //         // guestAgent.put('/api/apartments/' + aptId)
    //         //     .expect(401)
    //         //     .end(function(err, res) {
    //         //         if (err) return done(err);
    //         //         done();
    //         //     });
    //     });
    //     xit('can delete apartment', function() {
    //         // loggedInAdmin.delete('/api/apartments/' + aptId)
    //         //     .expect(204)
    //         //     .end(function(err, res) {
    //         //         if (err) return done(err);
    //         //         done();
    //         //     });
    //     });
    //     xit('Non admin cannot delete apartment', function() {
    //         // guestAgent.delete('/api/apartments/' + aptId)
    //         //     .expect(401)
    //         //     .end(function(err, res) {
    //         //         if (err) return done(err);
    //         //         done();
    //         //     });
    //     });
    // })
});
