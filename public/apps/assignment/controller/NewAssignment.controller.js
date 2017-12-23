sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text'
], function(BaseController, JSONModel, UIComponent, MessageToast, Button, Dialog, Text) {
	"use strict";

	return BaseController.extend("mm.apps.assignment.controller.NewAssignment", {
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


			let oView = this;
			let oUserModel = sap.ui.getCore().getModel("userModel");
			if (oUserModel != null) {
				oView.getView().setModel(oUserModel, "userModel");
			}
			else {
				var oModel = new JSONModel(); 
				
				$.ajax({
					url: "./api/users/drivers/list",
					headers: {
						Authorization: window.localStorage.token
					}
				})
				.fail(function(){
					// MessageToast.show("Error connecting to the Server");
					oMessageText.setText("Error connecting to the Server");
					oDialog.insertContent(oMessageText);
					oDialog.open();
					return;
				})
				.done(function(data, status, jqXHR){
					// load data from URL
					oModel.setData(data);
					sap.ui.getCore().setModel(oModel, "userModel");
					oView.getView().setModel(oModel, "userModel");
				});
			}
			let oVehicleModel = sap.ui.getCore().getModel("vehicleModel");
			if (oVehicleModel != null) {
				oView.getView().setModel(oVehicleModel);
			}
			else {
				var oNewVehicleModel = new JSONModel(); 
				$.ajax({
					url: "./api/vehicles/list",
					headers: {
						Authorization: window.localStorage.token
					}
				})
				.fail(function(){
					// MessageToast.show("Error connecting to the Server");
					oMessageText.setText("Error connecting to the Server");
					oDialog.insertContent(oMessageText);
					oDialog.open();
					return;
				})
				.done(function(data, status, jqXHR){
					// load data from URL
					oNewVehicleModel.setData(data);
					sap.ui.getCore().setModel(oNewVehicleModel, "vehicleModel");
					oView.getView().setModel(oNewVehicleModel);
				});
			}
		},
		
		onBeforeRendering : function () {

		},
        
		returnToLaunchpad: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("launchpad");
		},

		onSaveNewAssignment : function(){
			let sInpUsername = this.byId('InputDriverUsername').getSelectedItem().mProperties.key,
				sName = this.byId('InputDriverUsername').getSelectedItem().mProperties.additionalText,
				sInpPlateNo = this.byId('InputVehiclePlateNo').getSelectedItem().mProperties.key;

			// Check if username is already assigned
			if (sInpUsername) {
				let oAssignVehicle = sap.ui.getCore().getModel("assignVehicleModel");
				var result = null; 
				// if model is empty
				if (oAssignVehicle.getData().Assignments){
					for (var i = 0; i < oAssignVehicle.getData().Assignments.length; i++) { 
						if (oAssignVehicle.getData().Assignments[i].username === sInpUsername) { 
							result = oAssignVehicle.getData().Assignments[i];
							break;
						} 
					}
				}
				

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
				

				// If there no assignment for that username
				if (result === null){
					// var d = new Date();
					// var sDateAssigned = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
					// 	d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
					var dAssignedDate = Date.now();
					var formData = {
						username: sInpUsername,
						name: sName,
						plateNo: sInpPlateNo,
						dateAssigned: dAssignedDate
					};
					formData = JSON.stringify(formData);
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					
					$.ajax({
						url:"./api/assignment/add",
						type:"POST",
						data:formData,
						contentType:"application/json",
						headers: {
							Authorization: window.localStorage.token
						}
					})
					.fail(function(){
						// MessageToast.show("Error connecting to the Server");
						oMessageText.setText("Error connecting to the Server");
						oDialog.insertContent(oMessageText);
						oDialog.open();
						return;
					})
					.done(function(data,s,o){
						if (data.success === true) {
							// MessageToast.show("You have successfully assigned the user.");
							MessageToast.show(data.msg);
							oRouter.navTo("assignment");
						} else if(data.success === false) {
							oMessageText.setText(data.msg);
							oDialog.insertContent(oMessageText);
							oDialog.open();
							return;
						}
					});
					// same username, user already assigned
				} else {
					// MessageToast.show("Username already assigned to a vehicle.");
					oMessageText.setText("Username already assigned to a vehicle.");
					oDialog.insertContent(oMessageText);
					oDialog.open();
					return;
				}
			}

			
		}
	});
});