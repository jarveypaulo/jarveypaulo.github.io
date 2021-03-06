sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	'sap/ui/model/Filter'
], function (BaseController, JSONModel, MessageToast, Filter) {
	"use strict";

	return BaseController.extend("mm.apps.users.controller.UserInformation", {

		onInit: function () {
			var oRouter = this.getRouter();

			oRouter.getRoute("user").attachMatched(this._onRouteMatched, this);

			// Hint: we don't want to do it this way
			/*
			 oRouter.attachRouteMatched(function (oEvent){
				 var sRouteName, oArgs, oView;

				 sRouteName = oEvent.getParameter("name");
				 if (sRouteName === "employee"){
				 	this._onRouteMatched(oEvent);
				 }
			 }, this);
			 */
			// this.getView().setModel(sap.ui.getCore().getModel("userModel"));
		},

		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oView.setModel(sap.ui.getCore().getModel("userModel"));
			
			oView.bindElement({
				path : "/Users/" + oArgs.userID,
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},

		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

		// onShowResume : function (oEvent) {
		// 	var oCtx = this.getView().getBindingContext();

		// 	this.getRouter().navTo("employeeResume", {
		// 		employeeId : oCtx.getProperty("EmployeeID")
		// 	});
		// }

	});

});
