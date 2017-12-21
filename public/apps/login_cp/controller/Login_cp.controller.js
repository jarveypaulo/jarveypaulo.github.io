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
			// var oButton = this.byId('idAppControl');

			
		},

		onSavePassword: function() {
			let sPassword = this.byId('idNewPassword').getValue(),
				sPassword2 = this.byId('idNewPassword2').getValue();

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

			if (sPassword === "") {
				oMessageText.setText("New password is empty.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			} else if (sPassword2 === "") {
				oMessageText.setText("The retyped password is empty.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			if(sPassword.length < 8){
				oMessageText.setText("Your password must be at least 8 characters.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			if(sPassword.search(/[a-z]/i) < 0){
				oMessageText.setText("Your password must contain at least one letter.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			if(sPassword.search(/[0-9]/) < 0){
				oMessageText.setText("Your password must contain at least one digit.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			// passwords should be same
			if(sPassword != sPassword2){
				oMessageText.setText("The retyped password does not match the new password.");
				oDialog.insertContent(oMessageText);
				oDialog.open();
				return;
			}
			var formData = {
				password: sPassword2
			};
			formData = JSON.stringify(formData);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			$.ajax({
				url:"./api/users/changepassword",
				type:"PUT",
				data:formData,
				contentType:"application/json",
				headers: {
					Authorization: window.localStorage.token
				},
				// beforeSend:function(e){e.setRequestHeader("X-CSRF-Token","Fetch")},
				success:function(data,s,o){
					if (data.success === true) {
						MessageToast.show("You are now successfully changed your password");

						var oNewProfileModel = new JSONModel(); 
						oNewProfileModel.setData("");
						sap.ui.getCore().setModel(oNewProfileModel, "profileModel");
						// remove jwt
						window.localStorage.clear();
						location.reload();
						oRouter.navTo("login");
					} else if(data.success === false) {
						oMessageText.setText(data.msg);
						oDialog.insertContent(oMessageText);
						oDialog.open();
					}
				}
			});
		}
	});
});