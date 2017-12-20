const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Bookings = require('../models/bookings');

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

// Add New Bookings
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {    
    Bookings.getLastMileageOfVehicle(req.body.plateNo, function(err, result) {
        if(req.body.mileageStart < result.mileageEnd){
            res.json({
                success: false, 
                msg:'Last recorded mileage is '+result.mileageEnd+'. New mileage must be same or greater than this.'
            });
        } else {
            // check open booking for that Vehicle
            let query = {
                plateNo: req.body.plateNo,
                releasedDate: ""
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
                        bookedDate: req.body.bookedDate,
                        releasedDate: req.body.releasedDate,
                        mileageStart: req.body.mileageStart,
                        mileageEnd: req.body.mileageEnd
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
    updatedBookings.releasedDate = req.body.releasedDate;
    updatedBookings.mileageEnd = req.body.mileageEnd;

    let query = {
        username: req.body.username,
        plateNo: req.body.plateNo,
        bookedDate: req.body.bookedDate,
        releasedDate: ""
    }

    Bookings.updateBookings(query, updatedBookings, (err, booking) => {
        if (err){
            res.json({success: false, msg:'Failed to update vehicle ride details'});
        } else {
            res.json({success: true, msg: 'Vehicle ride successfully updated'});
        }
    });
});

// Get Open Bookings
router.get('/open', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    // empty Release Date
    let query = {
        releasedDate: ""
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