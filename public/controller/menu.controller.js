sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("mm.controller.menu", {
		onInit: function() {
			
		},

		navigateToDashboard: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("launchpad");
		},

		navigateToApp: function(oEvent) {
			var sTarget;
			var sTitleApp = oEvent.getSource().getTitle();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			switch (sTitleApp) {
				case "Kalkulator kredytowy / leasingowy":

					sTarget = "credit";

					break;

				default:
					sTarget = "launchpad";
					break;
			}

			oRouter.navTo(sTarget);
		}
	});

});