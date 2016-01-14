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

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

    it('can find all available apartments', function() {});
    it('can create a new apartment', function() {});
    it('can update apartment', function() {});
    it('can delete apartment', function() {});
    it('can filter by price', function() {});
    it('can filter by bedrooms', function() {});
    it('can filter by rating', function() {});
    it('can filter by lease', function() {});
    it('can apply compound filters', function() {});
});
