const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
    employeeID: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    account_type: {
        type: String,
        required: true,
        enum: ['admin', 'driver']
    },
    lastname: {
        type: String
    },
    firstname: {
        type: String
    },
    mobile: {
        type: String
    },
    homephone: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.getUserByEmployeeId = function(employeeId, callback) {
    const query = {employeeID: employeeId}
    User.findOne(query, callback);
}

module.exports.getUserAll = function(callback) {
    const query = {};
    User.find(query, callback);
}

module.exports.getDriversAll = function(callback) {
    const query = {account_type: "driver"};
    User.find(query, callback);
}


// Function to add User to db
module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    })
}

// check and match the password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

// Function to update Bookings to db
module.exports.updatePassword = function(query, updatedUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(updatedUser.password, salt, (err, hash) => {
            if (err) throw err;
            updatedUser.password = hash;
            // newUser.save(callback);
            User.update(query, updatedUser, callback);
        });
    })
}