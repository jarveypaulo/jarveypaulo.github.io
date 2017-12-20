sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/ui/model/SimpleType'
], function(BaseController, JSONModel, UIComponent, MessageToast, Button, Dialog, Text, SimpleType) {
	"use strict";

	return BaseController.extend("mm.apps.manageVehicles.controller.manageVehicle", {
		onInit: function() {
			var oModel = new JSONModel(); 
			let oView = this;

			$.ajax({
				url: "./api/vehicles/list"
			}).done(function(data, status, jqXHR){
				// load data from URL
				oModel.setData(data);
				sap.ui.getCore().setModel(oModel, "manageVehicleModel");
				oView.getView().setModel(oModel);
			});
			// this.getView().setModel(sap.ui.getCore().getModel("userModel"));

			// // Register the view with the message manager
			// // Plate Number is required
			// var oInputPlateNo = this.byId('InputPlateNo'); 
			
			// sap.ui.getCore().getMessageManager().registerObject(oInputPlateNo, true);
			// attach handlers for validation errors
			sap.ui.getCore().getMessageManager().registerObject(oView.byId("InputPlateNo"), true);
			sap.ui.getCore().getMessageManager().registerObject(oView.byId("InputVehicleType"), true);
        },
        
		returnToLaunchpad: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("launchpad");
		},

		onListItemPressed : function(oEvent){
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			var sVehicleLine = oCtx.sPath.substr(10);
			this.getRouter().navTo("vehicle", {
				vehicleID : sVehicleLine
			});
		},

		customPlateNo : SimpleType.extend("text", {
			formatValue: function (oValue) {
				return oValue;
			},
			parseValue: function (oValue) {
				//parsing step takes place before validating step, value could be altered here
				return oValue;
			},
			validateValue: function (oValue) {
				// The following Regex is NOT a completely correct one and only used for demonstration purposes.
				// RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
				var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
				if (!oValue.match(rexMail)) {
					throw new ValidateException("'" + oValue + "' is not a valid email address");
				}
			}
		}),

		onSaveVehicle : function(){
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

			// Plate Number is required
			if (!this.byId('InputPlateNo').getValue()) {
				oMessageText.setText("Please input vehicle Plate Number.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}



			// Vehicel Type is required
			if (!this.byId('InputVehicleType').getValue()) {
				oMessageText.setText("Please input vehicle Plate Number.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			// Manufacturer is required
			if (!this.byId('InputManufacturer').getValue()) {
				oMessageText.setText("Please input vehicle manufacturer.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			// Vehicle Model is required
			if (!this.byId('InputModel').getValue()) {
				oMessageText.setText("Please input vehicle model.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			// Vehicle Year is required
			if (!this.byId('InputYear').getValue()) {
				oMessageText.setText("Please input year manufactured.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}

		}
	});
});