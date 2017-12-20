sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/ui/model/Filter'
], function(BaseController, JSONModel, UIComponent, MessageToast, Button, Dialog, Text, Filter) {
	"use strict";
	return BaseController.extend("mm.apps.booking.controller.Booking", {
		onInit: function() {
			let oMessageText = new Text();
			let oDialog = new Dialog({
				title: 'Error',
				type: 'Message',
				state: 'Error',
				beginButton: new Button({
					text: 'OK',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});

			// Get username
			let sUsername = new String;
			if (window.localStorage.token){
				let oProfileModel = sap.ui.getCore().getModel("profileModel");
				if (oProfileModel != null) {
					sUsername = oProfileModel.oData.username;
				}
				else {
					var oNewProfileModel = new JSONModel(); 
					
					$.ajax({
						url: "./api/users/profile",
						headers: {
							Authorization: window.localStorage.token
						},
						async: false
					})
					.fail(function(){
						MessageToast.show("Error connecting to the Server");
					})
					.done(function(data, status, jqXHR){
						// load data from URL
						oNewProfileModel.setData(data);
						sap.ui.getCore().setModel(oNewProfileModel, "profileModel");
						sUsername = data.username;
					});
				}
			}

			// // No assigned vehicle
			// if (!sPlateNo){
			// 	oMessageText.setText("No assigned vehicle.");
			// 	oDialog.insertContent(oMessageText);
			// 	oDialog.open();
			// 	return;
			// }


			window.localStorage.username = sUsername;

			var oUsername = {username: sUsername};
			oUsername = JSON.stringify(oUsername);
			let oInputVehicle = this.byId('assignedVehicle_id');
			// Get reference of the current view
			let oView = this;
			$.ajax({
				url:"./api/assignment/user",
				type:"POST",
				data: oUsername,
				contentType:"application/json",
				headers: {
					Authorization: window.localStorage.token
				}
			})
			.fail(function(){
				oMessageText.setText("Error connecting to the server");
				oDialog.insertContent(oMessageText);
				oDialog.open();
			})
			.done(function(data,s,o){
				if (data) {
					
					// Set value to the assigned vehicle
					// oInputVehicle.setValue(data.assignments.plateNo);

					var oModel = new JSONModel();
					let oPlateNo = {
						assignment: {
							plateNo: data.assignments.plateNo
						}
					};
					oModel.setData(oPlateNo);
					sap.ui.getCore().setModel(oModel, "assignedVehicle");
					oView.getView().setModel(oModel);

				} else {
					
				}
			});

			// Set initial value to zero
			// this.byId('startingMileage_id').setValue(0);


			// Check for open booking
			// var oOpenBooking = {
			// 	username: window.localStorage.username,
			// 	plateNo: oInputVehicle.getValue()
			// };
			// oOpenBooking = JSON.stringify(oOpenBooking);		
			
			let oInputBookedDate = this.byId('bookedDate_id'),
				oInpStartMileage = this.byId('startingMileage_id'),
				oInpEndMileage = this.byId('endingMileage_id'),
				oBtnBook = this.byId('btnBookId'),
				oBtnRelease = this.byId('btnReleaseId');
				// oBtnChangeVehicle = this.byId('btnChangeVehicleId');
			$.ajax({
				url:"./api/bookings/open",
				type:"GET",
				// data: oOpenBooking,
				contentType:"application/json",
				headers: {
					Authorization: window.localStorage.token
				}
			})
			.fail(function(){
				oMessageText.setText("Error connecting to the server");
				oDialog.insertContent(oMessageText);
				oDialog.open();
			})
			.done(function(data,s,o){
				if (data.Bookings.length > 0) {
					var result = null; 
					for (var i = 0; i < data.Bookings.length; i++) { 
						if (data.Bookings[i].username === window.localStorage.username) { 
							result = data.Bookings[i];
							break;
						}
					}
					if(result != null){
						oInputBookedDate.setValue(result.bookedDate);
						oInpStartMileage.setValue(result.mileageStart);

						oInpStartMileage.setEditable(false).setRequired(false);
						oInpEndMileage.setEditable(true).setRequired(true);
						oBtnBook.setEnabled(false);
						oBtnRelease.setEnabled(true);
						// oBtnChangeVehicle.setVisible(false);
					}
					result = null;
				} else {
					
				}
			});

		},
		
		onBeforeRendering : function () {

		},
        
		returnToLaunchpad: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.destroy();
			oRouter.navTo("launchpad");
		},

		onBook : function(oEvent){
			let sPlateNo = this.byId('assignedVehicle_id').getValue(),
				nStartingMileage = this.byId('startingMileage_id').getValue(),
				nEndingMileage   = this.byId('endingMileage_id').getValue();

			let oMessageText = new Text();
			let oDialog = new Dialog({
				title: 'Error',
				type: 'Message',
				state: 'Error',
				beginButton: new Button({
					text: 'OK',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});
			// No assigned vehicle
			if (!sPlateNo){
				oMessageText.setText("No assigned vehicle.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}

			// Starting Mileage is required
			if (!nStartingMileage) {
				oMessageText.setText("Please input the starting mileage.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			// DD-MM-YYYY HH:MM
			var d = new Date();
			var sBookDate = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
				d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
			// Set Booked Date
			let oInputBookedDate = this.byId('bookedDate_id');
			
			// Get reference of UI elem
			let oInpStartMileage = this.byId('startingMileage_id'),
				oInpEndMileage = this.byId('endingMileage_id'),
				oBtnBook = this.byId('btnBookId'),
				oBtnRelease = this.byId('btnReleaseId');
				// oBtnChangeVehicle = this.byId('btnChangeVehicleId');

			// SAVE the new booking
			var oBookings = {
				username: window.localStorage.username,
				plateNo: sPlateNo, // this.byId('assignedVehicle_id').getValue(),
				bookedDate: sBookDate,
				mileageStart: this.byId('startingMileage_id').getValue(),
				releasedDate: "",
				mileageEnd: ""
			};
			oBookings = JSON.stringify(oBookings);
			$.ajax({
				url:"./api/bookings/add",
				type:"POST",
				data: oBookings,
				contentType:"application/json",
				headers: {
					Authorization: window.localStorage.token
				}
			})
			.fail(function(){
				oMessageText.setText("Error connecting to the server");
				oDialog.insertContent(oMessageText);
				oDialog.open();
			})
			.done(function(data,s,o){
				if (data.success === true) {
					MessageToast.show("Booking is successful!");

					oInputBookedDate.setValue(sBookDate);
					oInpStartMileage.setEditable(false).setRequired(false);
					oInpEndMileage.setEditable(true).setRequired(true);
					oBtnBook.setEnabled(false);
					oBtnRelease.setEnabled(true);
					// oBtnChangeVehicle.setVisible(false);
				} else {
					oMessageText.setText(data.msg);
					oDialog.insertContent(oMessageText);
					oDialog.open();
				}
			});
		},

		onRelease: function () {
			let nStartingMileage = this.byId('startingMileage_id').getValue(),
				nEndingMileage   = this.byId('endingMileage_id').getValue();

			let oMessageText = new Text();
			let oDialog = new Dialog({
				title: 'Error',
				type: 'Message',
				state: 'Error',
				beginButton: new Button({
					text: 'OK',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});

			
			// Check if Ending Mileage is empty
			if (!nEndingMileage) {
				oMessageText.setText("Please input the ending mileage.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			} 
			let nStart = parseInt(nStartingMileage),
				nEnd = parseInt(nEndingMileage);
			// Check if Starting Mileage is Greater than Ending Mileage
			if ( nStart > nEnd ) {
				oMessageText.setText("Ending Mileage must be greater than Starting Mileage.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			
			// Get reference of UI elem
			let oInputBookedDate = this.byId('bookedDate_id'),
				oInpStartMileage = this.byId('startingMileage_id'),
				oInpEndMileage = this.byId('endingMileage_id'),
				oBtnBook = this.byId('btnBookId'),
				oBtnRelease = this.byId('btnReleaseId');
				// oBtnChangeVehicle = this.byId('btnChangeVehicleId');

			let sPlateNo = this.byId('assignedVehicle_id').getValue();

			// DD-MM-YYYY HH:MM
			var d = new Date();
			var sReleaseDate = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
				d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

			// UPDATE the booking
			var oBookings = {
				username: window.localStorage.username,
				plateNo: sPlateNo,
				bookedDate: oInputBookedDate.getValue(),
				releasedDate: sReleaseDate,
				mileageEnd: nEndingMileage
			};
			oBookings = JSON.stringify(oBookings);
			$.ajax({
				url:"./api/bookings/add",
				type:"PUT",
				data: oBookings,
				contentType:"application/json",
				headers: {
					Authorization: window.localStorage.token
				}
			})
			.fail(function(){
				oMessageText.setText("Error connecting to the server");
				oDialog.insertContent(oMessageText);
				oDialog.open();
			})
			.done(function(data,s,o){
				if (data.success === true) {
					// MessageToast.show("Release success!");

					let oDialogSuccess = new Dialog({
						title: 'Release Success',
						type: 'Message',
						state: 'Success',
						beginButton: new Button({
							text: 'OK',
							press: function () {
								oDialogSuccess.close();
							}
						}),
						afterClose: function() {
							oDialogSuccess.destroy();
						}
					});

					oMessageText.setText("You have released vehicle "+sPlateNo+". This vehicle is now available for booking.");
					oDialogSuccess.insertContent(oMessageText);
					oDialogSuccess.open();

					oInputBookedDate.setValue("");
					oInpStartMileage.setValue("").setEditable(true).setRequired(true);
					oInpEndMileage.setValue("").setEditable(false).setRequired(false);
					oBtnBook.setEnabled(true);
					oBtnRelease.setEnabled(false);
					// oBtnChangeVehicle.setVisible(true);

				} else {
					oMessageText.setText(data.msg);
					oDialog.insertContent(oMessageText);
					oDialog.open();
				}
			});

		},

		onExit : function(){
			// this.destroy();
		}
	});
});