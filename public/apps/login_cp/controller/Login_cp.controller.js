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
    
	return BaseController.extend("mm.apps.login_cp.controller.Login_cp", {
		onInit: function() {
			var oButton = this.byId('idAppControl');

			
		},

		onChangePassword: function() {
			let sUsername = this.byId('usernameInput').getValue(),
				sPassword = this.byId('passwordInput').getValue();

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

			let oMessageText = new Text();

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
				contentType:"application/json",
				// beforeSend:function(e){e.setRequestHeader("X-CSRF-Token","Fetch")},
				success:function(data,s,o){
					if (data.success === true) {
						MessageToast.show("You are now successfully logged in.");
						var oModel = new JSONModel();
						oModel.setData(data);
						sap.ui.getCore().setModel(oModel, "loggedAccount");
						oRouter.navTo("launchpad");
					} else if(data.success === false) {
						oMessageText.setText(data.msg);
						oDialog.insertContent(oMessageText);
						oDialog.open();
					}
				}
			});
		},

		onChangePassword: function () {

		}
	});
});