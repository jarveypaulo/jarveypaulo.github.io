const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Vehicle = require('../models/vehicles');

// All Vehicle
// any route that needs to be protectd must put authenticate as 2nd parameter
router.get('/list', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    Vehicle.getVehicleAll(function(err, vehicles) {
        var vehicleAll = [];
        vehicles.forEach(function(vehicle) {
            vehicleAll.push(vehicle);
        }, this);
        
        res.send({Vehicles : vehicleAll});
    });
});

// Add New Vehicle
router.post('/add', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    let newVehicle = new Vehicle({
        plateNo: req.body.plateNo,
        vehicleType: req.body.vehicleType,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        color: req.body.color,
        manufacturerYear: req.body.manufacturerYear,
        engineNo: req.body.engineNo,
        chassisNo: req.body.chassisNo,
        mileage: req.body.mileage
    });

    Vehicle.addVehicle(newVehicle, (err, vehicle) => {
        if (err){
            res.json({success: false, msg:'Failed to add new vehicle'});
        } else {
            res.json({success: true, msg: 'Vehicle added successfully'});
        }
    });
});

// Vehicle
// any route that needs to be protectd must put authenticate as 2nd parameter
router.get('/vehicle', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    res.json({ vehicle: req.vehicle });
});

module.exports = router;