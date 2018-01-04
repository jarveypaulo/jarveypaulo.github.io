sap.ui.define([
	"mm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent",
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text'
], function(BaseController, JSONModel, UIComponent, MessageToast, Filter, Button, Dialog, Text) {
	"use strict";

	return BaseController.extend("mm.apps.users.controller.User", {
		onInit: function() {
			let oView = this;
			let oUserModel = sap.ui.getCore().getModel("userModel");
			if (oUserModel != null) {
				oView.getView().setModel(oUserModel, "userModel");
			}
			else {
				var oModel = new JSONModel(); 
				
				$.ajax({
					url: "./api/users/drivers/list",
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
					sap.ui.getCore().setModel(oModel, "userModel");
					oView.getView().setModel(oModel);
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

			var sUserLine = oCtx.sPath.substr(7);
			this.getRouter().navTo("user", {
				userID : sUserLine
			});
		},

		handleRefresh : function (){
			setTimeout(function () {
				this.byId("pullToRefresh").hide();
				let oView = this;
				var oModel = new JSONModel(); 
				$.ajax({
					url: "./api/users/drivers/list",
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
					sap.ui.getCore().setModel(oModel, "userModel");
					oView.getView().setModel(oModel);
				});
			}.bind(this), 1000);
		},

		onSearch : function(){
			var oList = this.byId("userList");
			var oSearchField = this.byId("searchField");
			var sQuery = oSearchField.getValue();
			var aFilters = [];
			if (sQuery && sQuery.length) {
				aFilters.push(new Filter("firstname", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			oList.getBinding("items").filter(aFilters);
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