const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/users');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        employeeID: req.body.employeeID,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        account_type: req.body.account_type,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        mobile: req.body.mobile,
        homephone: req.body.homephone
    });
    User.addUser(newUser, (err, user) => {
        if (err){
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered successfully'});
        }
    });

});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username,
          password = req.body.password;

    // check if user exists
    User.getUserByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user){
            return res.json({success: false, msg: 'Invalid Username '});
        }

        // check and match the password
        User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            // if password matches
            if(isMatch){
                var oPayload = {id: user._id};
                const token = jwt.sign(oPayload, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        employeeID: user.employeeID,
                        username: user.username,
                        email: user.email,
                        account_type: user.account_type
                    }
                });

            } else {
                return res.json({success: false, msg: 'Invalid password'});
            }
        });
    });
});

// Profile
// any route that needs to be protectd must put authenticate as 2nd parameter
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json(req.user);
});

router.put('/changepassword', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let query = {
        username: req.user.username
    }

    let updatedUser = {
        password: req.body.password
    }

    User.updatePassword(query, updatedUser, (err, user) => {
        if (err){
            res.json({success: false, msg:'Failed to change user password.'});
        } else {
            res.json({success: true, msg: 'User password changed successfully'});
        }
    });
});

// Drivers List
router.get('/drivers/list', passport.authenticate('jwt', { session: false }), 
    (req, res, next) => {
    User.getDriversAll(function(err, users) {
        var userMap = [];
        users.forEach(function(user) {
            let oUser = {};
            oUser.username = user.username;
            oUser.employeeID = user.employeeID;
            oUser.lastname = user.lastname;
            oUser.firstname = user.firstname;
            oUser.mobile = user.mobile;
            oUser.homephone = user.homephone;
            userMap.push(oUser);
        }, this);
        res.send({Users : userMap});
    });
});

module.exports = router;