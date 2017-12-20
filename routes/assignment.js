const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Assignments = require('../models/assignment');
const Bookings = require('../models/bookings');

// All Assignments
router.get('/list', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    Assignments.getAssignmentsAll(function(err, assignments) {
        var assignmentsAll = [];
        assignments.forEach(function(assignment) {
            assignmentsAll.push(assignment);
        }, this);
        res.send({Assignments : assignmentsAll});
    });
});

// Add New Assignments
router.post('/add', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    let newAssignment = new Assignments({
        username: req.body.username,
        name: req.body.name,
        plateNo: req.body.plateNo,
        dateAssigned: req.body.dateAssigned
    });
    Assignments.addAssignments(newAssignment, (err, assignment) => {
        if (err){
            let updatedAssignment = {};
            updatedAssignment.name = req.body.name,
            updatedAssignment.plateNo = req.body.plateNo;
            updatedAssignment.dateAssigned = req.body.dateAssigned;
        
            let query = {username: req.body.username}
        
            Assignments.updateAssignments(query, updatedAssignment, (err, assignment) => {
                if (err){
                    res.json({
                        success: false, 
                        msg:'Failed to assign vehicle '+req.body.plateNo+'to user '+req.body.username
                    });
                } else {
                    res.json({
                        success: true, 
                        msg: 'Vehicle '+assignment.plateNo+'has been assigned to user '+assignment.username+' successfully'
                    });
                }
            });
        } else {
            res.json({
                success: true, 
                msg: 'Vehicle '+assignment.plateNo+'has been assigned to user '+assignment.username+' successfully'
            });
        }
    });
});

// Add New Assignments
router.put('/add', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    let updatedAssignment = {};
    updatedAssignment.name = req.body.name,
    updatedAssignment.plateNo = req.body.plateNo;
    updatedAssignment.position = req.body.position;

    let query = {username: req.body.username}

    Assignments.updateAssignments(query, updatedAssignment, (err, assignment) => {
        if (err){
            res.json({success: false, msg:'Failed to assign vehicle to user'});
        } else {
            res.json({success: true, msg: 'Vehicle assigned to user successfully'});
        }
    });
});

// All Assignments
router.post('/user', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    // let query = {username: req.body.username};
    let username = req.body.username;
    Assignments.getAssignmentsByUsername(username, function(err, assignments) {
        res.send({assignments});
    });
});

router.delete('/user', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    // check first if there is an open booking by that user
    // check open booking for that Vehicle
    let queryOpenBook = {
        username: req.body.username,
        releasedDate: ""
    }
    Bookings.openBookingVehicle(queryOpenBook, (err, booking) => {
        if (booking) {
            res.json({
                success: false, 
                msg:'Assignment cannot be deleted. Vehicle '+booking.plateNo+' is being driven by '+booking.username+'. Wait until it is parked.'
            });
        } else {
            let query = {username: req.body.username};
            Assignments.removeAssignmentsByUsername(query, function(err, assignment) {
                if (err){
                    res.json({
                        success: false, 
                        msg:'Failed to delete the vehicle assignment of user '+req.body.username
                    });
                } else {
                    res.json({
                        success: true, 
                        msg: 'Assignment to user '+req.body.username+' has been deleted successfully.'
                    });
                }
            });
        }
    })         
});

// Assignments
router.get('/assignment', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
    res.json({ assignment: req.assignment });
});

module.exports = router;