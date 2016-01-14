// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Apartment Endpoints', function () {

    var userInfo = {
		email: 'joe@gmail.com',
		password: 'shoopdawoop',
        admin: true
	};
    var guestAgent;
    // var loggedInAgent;

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	// beforeEach('Create User', function (done) {
    //     User.create(userInfo, done);
	// });

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

    beforeEach('Create guest agent', function () {
        guestAgent = supertest.agent(app);
    });

    // beforeEach('Create loggedIn user agent and authenticate', function (done) {
    //     loggedInAgent = supertest.agent(app);
    //     loggedInAgent.post('/login').send(userInfo).end(done);
    // });

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

    describe('Admin capabilities', function() {

        var loggedInAdmin;
        var guestAgent;
        var adminInfo = {
            email: 'joe@gmail.com',
            password: 'shoopdawoop',
            admin: true
        };

        beforeEach('Create User', function (done) {
            User.create(adminInfo, done);
        });

        beforeEach('Create loggedIn user agent and authenticate', function (done) {
            loggedInAdmin = supertest.agent(app);
            loggedInAdmin.post('/login').send(userInfo).end(done);
        });

        beforeEach('Create guest agent', function () {
            guestAgent = supertest.agent(app);
        });

        xit('can create a new apartment', function(done) {
            loggedInAdmin.post('/api/apartments')
                .send({
                    streetAddress: '5 Hanover Square',
                    title: "Fullstack Academy"
                })
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    console.log(res.body)
                    expect(res.body).to.be.an('object');
                    expect(res.body.title).to.equal("Fullstack Academy");
                    done();
                });
        });
        xit('Non admin cannot create a new apartment', function(done) {
            guestAgent.post('/api/apartments')
                .send({
                    streetAddress: '5 Hanover Square',
                    title: "Fullstack Academy"
                })
                .expect(401)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
        xit('can update apartment', function() {
            // loggedInAdmin.put('/api/apartments/' + aptId)
            //     .expect(200)
            //     .end(function(err, res) {
            //         if (err) return done(err);
            //         done();
            //     });
        });
        xit('Non admin cannot update apartment', function() {
            // guestAgent.put('/api/apartments/' + aptId)
            //     .expect(401)
            //     .end(function(err, res) {
            //         if (err) return done(err);
            //         done();
            //     });
        });
        xit('can delete apartment', function() {
            // loggedInAdmin.delete('/api/apartments/' + aptId)
            //     .expect(204)
            //     .end(function(err, res) {
            //         if (err) return done(err);
            //         done();
            //     });
        });
        xit('Non admin cannot delete apartment', function() {
            // guestAgent.delete('/api/apartments/' + aptId)
            //     .expect(401)
            //     .end(function(err, res) {
            //         if (err) return done(err);
            //         done();
            //     });
        });
    })


    describe('Search', function() {
        xit('can find all available apartments', function(done) {
            guestAgent.get('/api/apartments')
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(0);
                    done();
                });
        });
        it('can filter by price', function(done) {
            guestAgent.post('api/apartments/filter')
                .send({
                    monthlyPrice: {$gt: 0, $lt: 1000},
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    console.log(res.body)
                    // expect(res.body.monthlyPrice.$gt).to.equal(1000)
                    done();
                })
        });
        xit('can filter by bedrooms', function() {});
        xit('can filter by rating', function() {});
        xit('can filter by lease', function() {});
        xit('can apply compound filters', function() {});
    })
});
