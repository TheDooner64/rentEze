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
		password: 'shoopdawoop'
	};
    var guestAgent;
    var loggedInAgent;

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	beforeEach('Create User', function (done) {
        User.create(userInfo, done);
	});

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

    beforeEach('Create guest agent', function () {
        guestAgent = supertest.agent(app);
    });

    beforeEach('Create loggedIn user agent and authenticate', function (done) {
        loggedInAgent = supertest.agent(app);
        loggedInAgent.post('/login').send(userInfo).end(done);
    });

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

    it('can find all available apartments', function(done) {
        guestAgent.get('/api/apartments')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(0);
                done();
            });
    });
    it('admin can create a new apartment', function(done) {
        loggedInAgent.post('/api/apartments')
            .send({
                streetAddress: '5 Hanover Square',
                title: "Fullstack Academy"
            })
            .expect(201)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.be.an('object');
                expect(res.body.title).to.equal("Fullstack Academy");
                done();
            });
    });
    it('admin can update apartment', function() {
        // loggedInAgent.put('/api/apartments/' + aptId)
        //     .expect(200)
        //     .end(function(err, res) {
        //         if (err) return done(err);
        //         done();
        //     });

    });
    it('can delete apartment', function() {});
    it('can filter by price', function() {});
    it('can filter by bedrooms', function() {});
    it('can filter by rating', function() {});
    it('can filter by lease', function() {});
    it('can apply compound filters', function() {});
});
