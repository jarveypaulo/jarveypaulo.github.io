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
					MessageToast.show("Error connecting to the Server");
				})
				.done(function(data, status, jqXHR){
					// load data from URL
					oNewProfileModel.setData(data);
					sap.ui.getCore().setModel(oNewProfileModel, "profileModel");
					oView.getView().setModel(oNewProfileModel);
				});
			}
		
		},
        
		returnToLaunchpad: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("launchpad");
		}

		// _onRouteMatched : function (oEvent) {
		// 	var oArgs, oView;
		// 	oArgs = oEvent.getParameter("arguments");
		// 	oView = this.getView();

		// 	oView.setModel(sap.ui.getCore().getModel("userModel"));
			
		// 	oView.bindElement({
		// 		path : "/Users/" + oArgs.userID,
		// 		events : {
		// 			change: this._onBindingChange.bind(this),
		// 			dataRequested: function (oEvent) {
		// 				oView.setBusy(true);
		// 			},
		// 			dataReceived: function (oEvent) {
		// 				oView.setBusy(false);
		// 			}
		// 		}
		// 	});
		// },

		// _onBindingChange : function (oEvent) {
		// 	// No data for the binding
		// 	if (!this.getView().getBindingContext()) {
		// 		this.getRouter().getTargets().display("notFound");
		// 	}
		// },

		// onShowResume : function (oEvent) {
		// 	var oCtx = this.getView().getBindingContext();

		// 	this.getRouter().navTo("employeeResume", {
		// 		employeeId : oCtx.getProperty("EmployeeID")
		// 	});
		// }

	});

});
