'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    classification: {
        type: String
    },
    isAdmin: {
        type: Boolean
    },
    // Remember, there is a virtual property for fullName, see below.
    // (but you can't access it on the front end!)
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    apartmentsOwned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment'
    }]
});

// pre-validate hook to ensure that a user isn't saved or updated with a value for the
// apartmentsOwned property unless the user is also a landlord
// schema.pre('validate', function(next) {
//     var user = this;
//     if (user.apartmentsOwned && this.classification !== "renter") throw new Error('Renters can\'t possess any apartments!');
// });

// virtual property for the user's full name
schema.virtual('fullName').get(function () {
    var user = this;
    return user.firstName + " " + user.lastName;
});

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize = function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);
