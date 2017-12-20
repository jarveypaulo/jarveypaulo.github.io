sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/m/MessageToast'
], function(BaseController, JSONModel, UIComponent, Button, Dialog, Text, MessageToast) {
	"use strict";
    
	return BaseController.extend("mm.apps.login.controller.Login", {
		onInit: function() {
			// var oButton = this.byId('idAppControl');
			// sap.ui.core.Control.setVisible(false);
		},

		onLogin: function() {
			let sUsername = new String,
				sPassword = this.byId('passwordInput').getValue();
			
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
			
			sUsername = this.byId('usernameInput').getValue();
			// Validate Username and Password
			if (sUsername==="") {
				oMessageText.setText("Username is empty");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			} else if (sPassword==="") {
				oMessageText.setText("Password is empty");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			
			// convert username to capital
			sUsername = sUsername.toUpperCase();

			// check if user already logged in using JWT
			// if (window.localStorage.token){
			// 	$.ajax({
			// 		url: "./api/users/profile"
			// 	})
			// 	.fail(function(){
			// 		MessageToast.show("Error connecting to the Server");
			// 	})
			// 	.done(function(data, status, jqXHR){
			// 		// load data from URL
			// 		oNewVehicleModel.setData(data);
			// 		sap.ui.getCore().setModel(oNewVehicleModel, "loggedAccountModel");
			// 		oView.getView().setModel(oNewVehicleModel);
			// 	});
			// }

			var formData = {
				username: sUsername,
				password: sPassword
			};

			formData = JSON.stringify(formData);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			$.ajax({
				url:"./api/users/authenticate",
				type:"POST",
				data:formData,
				contentType:"application/json"
			})
			.fail(function(){
				oMessageText.setText("Error connecting to the server");
				oDialog.insertContent(oMessageText);
				oDialog.open();
			})
			.done(function(data,s,o){
				if (data.success === true) {
					window.localStorage.token = data.token;
					// window.localStorage.username = data.user.username;
					MessageToast.show("You are now successfully logged in.");
					var oModel = new JSONModel();
					oModel.setData(data.user);
					sap.ui.getCore().setModel(oModel, "loggedAccount");
					oRouter.navTo("launchpad");
				} else if(data.success === false) {
					oMessageText.setText(data.msg);
					oDialog.insertContent(oMessageText);
					oDialog.open();
				}
			});

		},

		onChangePassword: function () {

		}
	});
});