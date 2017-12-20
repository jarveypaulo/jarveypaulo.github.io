sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	'sap/m/MessageToast',
	'sap/ui/model/Filter'
], function(BaseController, JSONModel, UIComponent, MessageToast, Filter) {
	"use strict";

	return BaseController.extend("mm.apps.vehicles.controller.Vehicle", {
		onInit: function() {
			let oVehicleModel = sap.ui.getCore().getModel("vehicleModel");
			let oView = this;
			if (oVehicleModel != null) {
				oView.getView().setModel(oVehicleModel);
			}
			else {
				var oNewVehicleModel = new JSONModel(); 
				
				$.ajax({
					url: "./api/vehicles/list",
					headers: {
						Authorization: window.localStorage.token
					}
				})
				.fail(function(){
					MessageToast.show("Error connecting to the Server");
				})
				.done(function(data, status, jqXHR){
					// load data from URL
					oNewVehicleModel.setData(data);
					sap.ui.getCore().setModel(oNewVehicleModel, "vehicleModel");
					oView.getView().setModel(oNewVehicleModel);
				});
			}

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

		onAddVehicle : function() {
			this.getRouter().navTo("manageVehicle");
		},

		handleRefresh : function (){
			setTimeout(function () {
				this.byId("pullToRefresh").hide();
				let oView = this;
				var oNewVehicleModel = new JSONModel(); 
				$.ajax({
					url: "./api/vehicles/list",
					headers: {
						Authorization: window.localStorage.token
					}
				})
				.fail(function(){
					MessageToast.show("Error connecting to the Server");
				})
				.done(function(data, status, jqXHR){
					// load data from URL
					oNewVehicleModel.setData(data);
					sap.ui.getCore().setModel(oNewVehicleModel, "vehicleModel");
					oView.getView().setModel(oNewVehicleModel);
				});
			}.bind(this), 1000);
		},

		onSearchVehicle: function(){
			var oList = this.byId("vehicleList");
			var oSearchField = this.byId("searchFieldVehicle");
			var sQuery = oSearchField.getValue();
			var aFilters = [];
			if (sQuery && sQuery.length) {
				aFilters.push(new Filter("plateNo", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			oList.getBinding("items").filter(aFilters);
		}
	});
});