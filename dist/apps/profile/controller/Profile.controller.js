sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	'sap/ui/model/Filter'
], function (BaseController, JSONModel, MessageToast, Filter) {
	"use strict";

	return BaseController.extend("mm.apps.profile.controller.Profile", {

		onInit: function () {
            let oProfileModel = sap.ui.getCore().getModel("profileModel");
			let oView = this;
			if (oProfileModel != null) {
				oView.getView().setModel(oProfileModel);
			}
			else {
				var oNewProfileModel = new JSONModel(); 
				
				$.ajax({
					url: "./api/users/profile",
					headers: {
						Authorization: window.localStorage.token
					}
				})
				.fail(function(){
					oView.issueMessage('Error connecting to the Server');
				})
				.done(function(data, status, jqXHR){
					oNewProfileModel.setData(data);
					sap.ui.getCore().setModel(oNewProfileModel, "profileModel");
					oView.getView().setModel(oNewProfileModel);
				});
			}
		
		},
        
		returnToLaunchpad: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("launchpad");
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
