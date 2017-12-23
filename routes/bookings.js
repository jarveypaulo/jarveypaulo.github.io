const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Bookings = require('../models/bookings');
const Vehicle = require('../models/vehicles');

// All Bookings
// any route that needs to be protectd must put authenticate as 2nd parameter
router.get('/list', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Bookings.getBookingsAll(function(err, bookings) {
        var bookingsAll = [];
        bookings.forEach(function(booking) {
            bookingsAll.push(booking);
        }, this);
        res.send({Bookings : bookingsAll});
    });
});

router.get('/dailylist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Bookings.getBookingsDaily(function(err, bookings) {
        var bookingsAll = [];
        bookings.forEach(function(booking) {
            bookingsAll.push(booking);
        }, this);
        res.send({Bookings : bookingsAll});
    });
});

// Add New Bookings
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {    
    Vehicle.getVehicleByplateNo(req.body.plateNo, function(err, vehicle) {
        if(req.body.mileageStart < vehicle.mileage){
            res.json({
                success: false, 
                msg:'Last recorded mileage is '+vehicle.mileage+'. New mileage must be same or greater than this.'
            });
        } else {
            // check open booking for that Vehicle
            let query = {
                plateNo: req.body.plateNo,
                mileageEnd: null
                // releasedDate: Date("")
            }
            Bookings.openBookingVehicle(query, (err, booking) => {
                if (booking) {
                    res.json({
                        success: false, 
                        msg:'Vehicle '+booking.plateNo+' is being driven by '+booking.username+'. Wait until it is parked.'
                    });
                } else {
                    let newBookings = new Bookings({
                        username: req.body.username,
                        plateNo: req.body.plateNo,
                        bookedDate: Date(req.body.bookedDate),
                        // releasedDate: Date(req.body.releasedDate),
                        mileageStart: req.body.mileageStart,
                        // mileageEnd: req.body.mileageEnd
                    });
        
                    Bookings.addBookings(newBookings, (err, booking) => {
                        if (err){
                            res.json({success: false, msg:'Failed to ride the vehicle'});
                        } else {
                            res.json({success: true, msg: 'Vehicle ridden successfully'});
                        }
                    });
                }
            })            
        }
    });
});

// Update Bookings
router.put('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let updatedBookings = {};
    // updatedBookings.plateNo = req.body.plateNo;
    updatedBookings.releasedDate = Date(req.body.releasedDate);
    updatedBookings.mileageEnd = req.body.mileageEnd;

    let query = {
        username: req.body.username,
        plateNo: req.body.plateNo,
        // bookedDate: Date(req.body.bookedDate),
        mileageEnd: null
        // releasedDate: Date("")
    }
    // console.log(query);
    Bookings.updateBookings(query, updatedBookings, (err, booking) => {
        if (err){
            res.json({success: false, msg:'Failed to update vehicle ride details'});
        } else {
            // save the last mileage to the vehicle's mileage master data
            let queryVehicle = {
                plateNo: req.body.plateNo
            }
            let updatedVehicle = {};
            updatedVehicle.mileage = req.body.mileageEnd;
            Vehicle.updateVehicle(queryVehicle, updatedVehicle, (err, vehicle) => {
                if (err){
                    res.json({success: false, msg: 'Failed to update vehicle ride details'});
                } else {
                    res.json({success: true, msg: 'Vehicle ride successfully updated'});
                }
            });
        }
    });
});

// Get Open Bookings
router.get('/open', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    // empty Release Date
    let query = {
        mileageEnd: null
        // releasedDate: Date("")
    };

    Bookings.openBookings(query, function(err, bookings) {
        var bookingsAll = [];
        bookings.forEach(function(booking) {
            bookingsAll.push(booking);
        }, this);
        res.send({Bookings : bookingsAll});
    });
});

// Bookings
router.get('/booking', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    res.json({ booking: req.booking });
});

module.exports = router;