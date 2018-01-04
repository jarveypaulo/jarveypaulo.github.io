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
			
		},

		onLogin: function(sIsChangePassword) {
			let sUsername = new String,
				sPassword = this.byId('passwordInput').getValue();
			let oView = this;			
			sUsername = this.byId('usernameInput').getValue();
			// Validate Username and Password
			if (sUsername==="") {
				oView.issueMessage('Username is a required field.');
				return;
			} else if (sPassword==="") {
				oView.issueMessage('Password is a required field.');
				return;
			}
			// convert username to capital
			sUsername = sUsername.toUpperCase();

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
				oView.issueMessage('Error connecting to the server');
			})
			.done(function(data,s,o){
				if (data.success === true) {
					window.localStorage.token = data.token;
					var oModel = new JSONModel();
					oModel.setData(data.user);
					sap.ui.getCore().setModel(oModel, "loggedAccount");
					if (sIsChangePassword === 'true'){
						oRouter.navTo("login_cp");
					} else {
						
						MessageToast.show("You are now successfully logged in.");
						oRouter.navTo("launchpad");
					}
					
				} else if(data.success === false) {
					oView.issueMessage(data.msg);
				}
			});

		},

		onChangePassword: function () {
			this.onLogin('true');
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