sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/ui/model/Filter'
], function(BaseController, JSONModel, UIComponent, MessageToast, Button, Dialog, Text, Filter) {
	"use strict";

	return BaseController.extend("mm.apps.assignment.controller.Assignment", {
		onInit: function() {
			var oModel = new JSONModel(); 
			let oView = this;

			if (window.localStorage.token){
				var oFooterToolbar = this.byId('idFooterToolbar');
				var oTable = this.byId('tableAssignVehicleId');

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
			} 

			$.ajax({
				url: "./api/assignment/list",
				headers: {
					Authorization: window.localStorage.token
				}
			})
			.fail(function(){
				oView.issueMessage('Error connecting to the Server');
				return;
			})
			.done(function(data, status, jqXHR){
				oModel.setData(data);
				sap.ui.getCore().setModel(oModel, "assignVehicleModel");
				oView.getView().setModel(oModel);
			});
		},
        
		returnToLaunchpad: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("launchpad");
		},

		onAddAssignment: function(){
			this.getRouter().navTo("newAssignment");
		},

		onRemoveAssignment: function(oEvent){
			let oView = this;
			// Get index of the selection
			var aContexts = this.byId("tableAssignVehicleId").getSelectedContexts();
			let sIndex = new Number;
			var aUsername = [];
			let oAssignVechicleModel = sap.ui.getCore().getModel("assignVehicleModel");
			for (var i = 0; i < aContexts.length; i++) { 
				sIndex = aContexts[i].sPath.substr(13);
				aUsername.push(oAssignVechicleModel.getData().Assignments[sIndex].username);
			}
			var formData = {
				username: aUsername,
			};
			formData = JSON.stringify(formData);			
			$.ajax({
				url:"./api/assignment/user",
				type:"DELETE",
				data:formData,
				contentType:"application/json",
				headers: {
					Authorization: window.localStorage.token
				}
			})
			.fail(function(){
				oView.issueMessage('Error connecting to the Server');
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
					url: "./api/assignment/list",
					headers: {
						Authorization: window.localStorage.token
					}
				})
				.fail(function(){
					oView.issueMessage('Error connecting to the Server');
					return;
				})
				.done(function(data, status, jqXHR){
					oModel.setData(data);
					sap.ui.getCore().setModel(oModel, "assignVehicleModel");
					oView.getView().setModel(oModel);
				});
			}.bind(this), 1000);
		},

		onSearch: function(oEvent){
			var oTable = this.byId("tableAssignVehicleId");
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
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd MMM YYYY hh:mm:ss a"});
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