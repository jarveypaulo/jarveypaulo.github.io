const mongoose = require('mongoose');
const config = require('../config/database');

// Vehicle Schema
const VehicleSchema = mongoose.Schema({
    plateNo: {
        type: String,
        required: true,
        unique: true
    },
    vehicleType: {
        type: String 
    },
    manufacturer: {
        type: String 
    },
    model: {
        type: String 
    },
    color: {
        type: String 
    },
    manufacturerYear: {
        type: String 
    },
    engineNo: {
        type: String 
    },
    chassisNo: {
        type: String 
    },
    mileage: {
        type: Number
    },
    mileageServiced: {
        type: Number
    },
    dateServiced: {
        type: Date
    }
});

const Vehicle = module.exports = mongoose.model('Vehicle', VehicleSchema);

module.exports.getVehicleById = function(id, callback) {
    Vehicle.findById(id, callback);
}

module.exports.getVehicleByplateNo = function(plateNo, callback) {
    const query = {plateNo: plateNo}
    Vehicle.findOne(query, callback);
}

module.exports.getVehicleAll = function(callback) {
    const query = {};
    Vehicle.find(query, callback);
}

// Function to add Vehicle to db
module.exports.addVehicle = function(newVehicle, callback) {
    newVehicle.save(callback);
}

// Function to update Vehicle to db
module.exports.updateVehicle = function(query, updatedVehicle, callback) {
    Vehicle.update(query, updatedVehicle, callback);
}
