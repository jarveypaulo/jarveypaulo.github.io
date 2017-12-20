const mongoose = require('mongoose');
const config = require('../config/database');

// Assignment Schema
const AssignmentsSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    plateNo: {
        type: String
    },
    dateAssigned: {
        type: String
    }
});

const Assignments = module.exports = mongoose.model('Assignments', AssignmentsSchema);

module.exports.getAssignmentsById = function(id, callback) {
    Assignments.findById(id, callback);
}

module.exports.getAssignmentsByUsername = function(username, callback) {
    const query = {username: username};
    Assignments.findOne(query, callback);
}

// module.exports.getAssignmentsByEmployeeId = function(employeeId, callback) {
//     const query = {employeeId: employeeId};
//     Assignments.findOne(query, callback);
// }

module.exports.getAssignmentsAll = function(callback) {
    const query = {};
    Assignments.find(query, callback);
}

// Function to add Assignment to db
module.exports.addAssignments = function(newAssignment, callback) {
    newAssignment.save(callback);
}

module.exports.removeAssignmentsByUsername = function(query, callback) {
    Assignments.remove(query, callback);
}

// Function to update Assignment to db
module.exports.updateAssignments = function(query, updatedAssignment, callback) {
    Assignments.update(query, updatedAssignment, callback);
}