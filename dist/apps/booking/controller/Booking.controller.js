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
			let oView = this;
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
						oView.issueMessage('Error connecting to the server');
						return;
					})
					.done(function(data, status, jqXHR){
						// load data from URL
						oNewProfileModel.setData(data);
						sap.ui.getCore().setModel(oNewProfileModel, "profileModel");
						sUsername = data.username;
					});
				}
			}

			window.localStorage.username = sUsername;

			var oUsername = {username: sUsername};
			oUsername = JSON.stringify(oUsername);
			let oInputVehicle = this.byId('assignedVehicle_id');
			// Get reference of the current view
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
				oView.issueMessage('Error connecting to the server');
				return;
			})
			.done(function(data,s,o){
				if (data.assignments != null) {
					// Set value to the assigned vehicle
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
					oView.issueMessage('No assigned vehicle. Please contact the Transport Department.');
					return;
				}
			});

			let oInputBookedDate = this.byId('bookedDate_id'),
				oInpStartMileage = this.byId('startingMileage_id'),
				oInpEndMileage = this.byId('endingMileage_id'),
				oBtnBook = this.byId('btnBookId'),
				oBtnRelease = this.byId('btnReleaseId');
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
				oView.issueMessage('Error connecting to the server');
				return;
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
						oInputBookedDate.setValue(oView.formatDate(result.bookedDate));
						oInpStartMileage.setValue(result.mileageStart);

						oInpStartMileage.setEditable(false).setRequired(false);
						oInpEndMileage.setEditable(true).setRequired(true);
						oBtnBook.setEnabled(false);
						oBtnRelease.setEnabled(true);
					}
					result = null;
				} else {
					
				}
			});

		},
		        
		returnToLaunchpad: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("launchpad");
		},

		onBook : function(oEvent){
			let sPlateNo = this.byId('assignedVehicle_id').getValue(),
				nStartingMileage = this.byId('startingMileage_id').getValue(),
				nEndingMileage   = this.byId('endingMileage_id').getValue();
			let oView = this;
			// No assigned vehicle
			if (!sPlateNo){
				oView.issueMessage('No assigned vehicle. Please contact system administrator.');
				return;
			}

			// Starting Mileage is required
			if (!nStartingMileage) {
				oView.issueMessage('Please input the starting mileage');
				return;
			}
			let oInputBookedDate = this.byId('bookedDate_id');
			
			// Get reference of UI elem
			let oInpStartMileage = this.byId('startingMileage_id'),
				oInpEndMileage = this.byId('endingMileage_id'),
				oBtnBook = this.byId('btnBookId'),
				oBtnRelease = this.byId('btnReleaseId');

			// SAVE the new booking
			var dBookedDate = Date.now();
			var oBookings = {
				username: window.localStorage.username,
				plateNo: sPlateNo, 
				bookedDate: dBookedDate,
				mileageStart: this.byId('startingMileage_id').getValue()
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
				oView.issueMessage('Error connecting to the server');
				return;
			})
			.done(function(data,s,o){
				if (data.success === true) {
					MessageToast.show("Riding the vehicle is successful!");

					dBookedDate = oView.formatDate(dBookedDate);
					oInputBookedDate.setValue(dBookedDate);
					oInpStartMileage.setEditable(false).setRequired(false);
					oInpEndMileage.setEditable(true).setRequired(true);
					oBtnBook.setEnabled(false);
					oBtnRelease.setEnabled(true);
				} else {
					oView.issueMessage(data.msg);
				}
			});
		},

		onRelease: function () {
			let nStartingMileage = this.byId('startingMileage_id').getValue(),
				nEndingMileage   = this.byId('endingMileage_id').getValue();

			let oView = this;
			
			// Check if Ending Mileage is empty
			if (!nEndingMileage) {
				oView.issueMessage('Please input the ending mileage.');
				return;
			} 
			let nStart = parseInt(nStartingMileage),
				nEnd = parseInt(nEndingMileage);
			// Check if Starting Mileage is Greater than Ending Mileage
			if ( nStart > nEnd ) {
				oView.issueMessage('Ending Mileage must be greater than Starting Mileage.');
				return;
			}
			
			// Get reference of UI elem
			let oInputBookedDate = this.byId('bookedDate_id'),
				oInpStartMileage = this.byId('startingMileage_id'),
				oInpEndMileage = this.byId('endingMileage_id'),
				oBtnBook = this.byId('btnBookId'),
				oBtnRelease = this.byId('btnReleaseId');

			let sPlateNo = this.byId('assignedVehicle_id').getValue();

			// UPDATE the booking
			var dReleasedDate = Date.now();
			var oBookings = {
				username: window.localStorage.username,
				plateNo: sPlateNo,
				bookedDate: oInputBookedDate.getValue(),
				releasedDate: dReleasedDate,
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
				oView.issueMessage('Error connecting to the server');
				return;
			})
			.done(function(data,s,o){
				if (data.success === true) {
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
					let oMessageText = new Text();
					oMessageText.setText("You have parked vehicle "+sPlateNo+". This vehicle is now available for riding.");
					oDialogSuccess.insertContent(oMessageText);
					oDialogSuccess.open();

					oInputBookedDate.setValue("");
					oInpStartMileage.setValue("").setEditable(true).setRequired(true);
					oInpEndMileage.setValue("").setEditable(false).setRequired(false);
					oBtnBook.setEnabled(true);
					oBtnRelease.setEnabled(false);

				} else {
					oView.issueMessage(data.msg);
				}
			});

		},

		formatDate : function(v){
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd MMM YYYY hh:mm:ss a"});
			return oDateFormat.format(new Date(v));	
		},

		issueMessage : function(iv_message){
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

			oMessageText.setText(iv_message);
			oDialog.insertContent(oMessageText);
			oDialog.open();
		}
	});
});