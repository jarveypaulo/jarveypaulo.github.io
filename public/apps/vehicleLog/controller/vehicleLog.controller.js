sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/ui/model/Filter',
    'sap/m/GroupHeaderListItem'
], function(BaseController, JSONModel, UIComponent, MessageToast, Button, Dialog, Text, Filter, GroupHeaderListItem) {
	"use strict";

	return BaseController.extend("mm.apps.vehicleLog.controller.vehicleLog", {
		onInit: function() {
			var oModel = new JSONModel(); 
			let oView = this;

			if (window.localStorage.token){
				var oFooterToolbar = this.byId('idFooterToolbar');
				var oTable = this.byId('tablevehicleLogId');

				let oProfileModel = sap.ui.getCore().getModel("profileModel");
				let oView = this;
				if (oProfileModel != null) {

					if(oProfileModel.oData.account_type === 'admin'){
						oFooterToolbar.setVisible(true);
						oTable.setMode('MultiSelect');
					}
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
						return;
					})
					.done(function(data, status, jqXHR){
						// load data from URL
						oNewProfileModel.setData(data);
						sap.ui.getCore().setModel(oNewProfileModel, "profileModel");

						if(data.account_type === 'admin'){
							oFooterToolbar.setVisible(true);
							oTable.setMode('MultiSelect');
						}
					});
				}
			} else {
				oView.issueMessage('No data to be shown. Please logon to the application.');
				return;
			}

			// get assigned vehicle data
			$.ajax({
				url: "./api/bookings/list",
				headers: {
					Authorization: window.localStorage.token
				}
			})
			.fail(function(){
				oView.issueMessage("Error connecting to the Server");
				return;
			})
			.done(function(data, status, jqXHR){
				oModel.setData(data);
				sap.ui.getCore().setModel(oModel, "bookingsModel");
                oView.getView().setModel(oModel);
			});
		},
        
        
		getGroupHeader: function (oGroup){
			return new GroupHeaderListItem( {
				title: 'Plate No. ' + oGroup.key,
				upperCase: false
			} );
        },
        
		returnToLaunchpad: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("launchpad");
		},

		onRemoveVehicleLog: function(oEvent){
			// Get index of the selection
			let oView = this;
			var aContexts = this.byId("tablevehicleLogId").getSelectedContexts();
			let sIndex = new Number;
			var aId = [];
			let oVehicleLogModel = sap.ui.getCore().getModel("bookingsModel");
			for (var i = 0; i < aContexts.length; i++) { 
				sIndex = aContexts[i].sPath.substr(10);
				if(oVehicleLogModel.getData().Bookings[sIndex].mileageEnd){
					aId.push(oVehicleLogModel.getData().Bookings[sIndex]._id);
				// empty ending mileage must not be deleted
				} else {
					oView.issueMessage("Entry cannot be deleted. Wait until the vehicle is parked by the user.");
					return;
				}
			}
			
			var formData = {
				_id: aId,
			};
			formData = JSON.stringify(formData);			
			$.ajax({
				url:"./api/bookings/vehicleLogEntry",
				type:"DELETE",
				data:formData,
				contentType:"application/json",
				headers: {
					Authorization: window.localStorage.token
				}
			})
			.fail(function(){
				oView.issueMessage("Error connecting to the Server");
				return;
			})
			.done(function(data,s,o){
				if (data.success === true) {
					MessageToast.show(data.msg);
				} else if(data.success === false) {
					oView.issueMessage(data.msg);
					return;
				}
			});
		},
		
		handleRefresh : function (){
		
			setTimeout(function () {
				this.byId("pullToRefresh").hide();
				let oView = this;
				var oModel = new JSONModel(); 
				$.ajax({
					url: "./api/bookings/list",
					headers: {
						Authorization: window.localStorage.token
					}
				})
				.fail(function(){
					oView.issueMessage("Error connecting to the Server");
					return;
				})
				.done(function(data, status, jqXHR){
					oModel.setData(data);
					sap.ui.getCore().setModel(oModel, "bookingsModel");
					oView.getView().setModel(oModel);
				});
			}.bind(this), 1000);
		},

		onSearch: function(oEvent){
			var oTable = this.byId("tablevehicleLogId");
			var oSearchField = this.byId("searchField");
			var sQuery = oSearchField.getValue();
			var aFilters = [];
			if (sQuery && sQuery.length) {
				aFilters.push(new Filter("username", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			oTable.getBinding("items").filter(aFilters);
		},

		formatDate : function(v){
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd MMM YYYY"});
			return oDateFormat.format(new Date(v));	
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