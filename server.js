const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: '+err);
});

// Initialize our server
const app = express();

// Bring in User Routes
const users = require('./routes/users');

// Bring in Vehicle Routes
const vehicles = require('./routes/vehicles');

// Bring in Bookings Routes
const bookings = require('./routes/bookings');

// Bring in Assignment Routes
const assignment = require('./routes/assignment');

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Body Parser Middleware
app.use(bodyParser.json());

require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Body Parser Middleware
// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api/users', users);
app.use('/api/vehicles', vehicles);
app.use('/api/assignment', assignment);
app.use('/api/bookings', bookings);

// Index Route
app.get('/', function(req, res) {
    res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
    console.log('Server is listening to Port '+port);
});