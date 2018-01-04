sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("mm.controller.app", {
		
		onInit: function() {
			

			// // Check if user is logged in
			// if (!sap.ui.getCore().getModel("loggedAccount")) {
			// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// 	oRouter.navTo("login");
			// }

			// var oModel = new JSONModel(); 
			// $.ajax({
			// 	url: "./api/users/list"
			// }).done(function(data, status, jqXHR){
			// 	// load data from URL
			// 	oModel.setData(data);
			// 	sap.ui.getCore().setModel(oModel, "userModel");
			// });


			// var oViewModel,
			// 	fnSetAppNotBusy,
			// 	oListSelector = this.getOwnerComponent().oListSelector,
			// 	iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			// oViewModel = new JSONModel({
			// 	busy : true,
			// 	delay : 0
			// });
			// sap.ui.getCore().setModel(oViewModel, "appView");

			// fnSetAppNotBusy = function() {
			// 	oViewModel.setProperty("/busy", false);
			// 	oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// };

			// this.getOwnerComponent().getModel().metadataLoaded()
			// 		.then(fnSetAppNotBusy);

			// Makes sure that master view is hidden in split app
			// after a new list entry has been selected.
			// oListSelector.attachListSelectionChange(function () {
			// 	this.byId("idAppControl").hideMaster();
			// }, this);

			// apply content density mode to root view
			// this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		},

		onAfterDetailNavigate: function(oEvent) {
			oEvent.getSource().hideMaster();
		},
		
		showMaster: function(oEvent) {
			oEvent.getSource().showMaster();
		}

	});

});