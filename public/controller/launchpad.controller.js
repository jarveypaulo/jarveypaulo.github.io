sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/Popover',
	'sap/m/Button',
	'sap/m/Text',
	"sap/ui/model/json/JSONModel"
], function(Controller, Popover, Button, Text, JSONModel) {
	"use strict";

	return Controller.extend("mm.controller.launchpad", {
		onInit: function() {

		},

		onAccountPress: function(oEvent) {
			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("popOverAccount", "mm.view.Account", this);
				this.getView().addDependent(this._oPopover);
			}

			this._oPopover.openBy(oEvent.getSource());

		},

		onAccountShow: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("profile");
		},

		onLogout: function(oEvent) {
			// delete profile Model
			var oNewProfileModel = new JSONModel(); 
			oNewProfileModel.setData("");
			sap.ui.getCore().setModel(oNewProfileModel, "profileModel");
			// remove jwt
			window.localStorage.removeItem("token");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login");

		}
	});

});