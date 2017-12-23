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
			
		},

		onSavePassword: function() {
			let sPassword = this.byId('idNewPassword').getValue(),
				sPassword2 = this.byId('idNewPassword2').getValue();
			let oView = this;
			if (sPassword === "") {
				oView.issueMessage('New password is empty.');
				return;
			} else if (sPassword2 === "") {
				oView.issueMessage('The retyped password is empty.');
				return;
			}
			if(sPassword.length < 8){
				oView.issueMessage('Your password must be at least 8 characters.');
				return;
			}
			if(sPassword.search(/[a-z]/i) < 0){
				oView.issueMessage('Your password must contain at least one letter.');
				return;
			}
			if(sPassword.search(/[0-9]/) < 0){
				oView.issueMessage('Your password must contain at least one digit.');
				return;
			}
			// passwords should be same
			if(sPassword != sPassword2){
				oView.issueMessage('The retyped password does not match the new password.');
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
						oView.issueMessage(data.msg);
					}
				}
			});
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