const mongoose = require('mongoose');
const config = require('../config/database');

// Bookings Schema
const BookingsSchema = mongoose.Schema({
    username: {
        type: String
    },
    plateNo: {
        type: String
    },
    bookedDate: {
        type: Date
    },
    releasedDate: {
        type: Date
    },
    mileageStart: {
        type: Number
    },
    mileageEnd: {
        type: Number
    }
});

const Bookings = module.exports = mongoose.model('Bookings', BookingsSchema);

module.exports.getBookingsById = function(id, callback) {
    Bookings.findById(id, callback);
}

module.exports.getBookingsByUsername = function(username, callback) {
    const query = {username: username}
    Bookings.findOne(query, callback);
}

module.exports.getLastMileageOfVehicle = function(plateNo, callback) {
    const query = {plateNo: plateNo}
    // Bookings.findOne(query, callback);
    Bookings.findOne(query).sort('-mileageEnd').limit(1).exec(callback);
}

module.exports.openBookingVehicle = function(query, callback) {
    Bookings.findOne(query).limit(1).exec(callback);
}

module.exports.openBookings = function(query, callback) {
    Bookings.find(query, callback);
}

module.exports.getBookingsAll = function(callback) {
    const query = {};
    Bookings.find(query, callback);
}

module.exports.getBookingsDaily = function(callback) {
    var threeDaysAgo = new Date() - 3;
    let query = {bookedDate: threeDaysAgo}
    Bookings.find(query, callback);
}

// Function to add Bookings to db
module.exports.addBookings = function(newBookings, callback) {
    newBookings.save(callback);
}

// Function to update Bookings to db
module.exports.updateBookings = function(query, updatedBookings, callback) {
    Bookings.update(query, updatedBookings, callback);
}