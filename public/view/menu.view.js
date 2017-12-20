sap.ui.jsview("mm.view.menu", {

	getControllerName: function() {
		return "mm.controller.menu";
	},

	createContent: function(oController) {
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData('model/apps.json', "", false);

		var oHomeListItem = new sap.m.StandardListItem({
			title: "Launchpad",
			icon: "sap-icon://home",
			type: "Navigation",
			adaptTitleSize: true,
			press: function() {
				oRouter.navTo("launchpad");
			}
		});

		var dashboardList = new sap.m.List({
			items: [
				oHomeListItem
			]
		});

		var appList = new sap.m.List({
			headerText: "Apps"
		});

		var appListTemplate = new sap.m.StandardListItem({
			title: "{header}",
			icon: "sap-icon://{iconMenu}",
			adaptTitleSize: true,
			type: "Navigation",
			press: function() {
				oRouter.navTo(this.getBindingContext().getProperty("routeName"));
			}
		});

		appList.setModel(oModel);
		appList.bindAggregation("items", "/apps", appListTemplate);


		// Account
		var oAccountListItem = new sap.m.StandardListItem({
			title: "Profile",
			icon: "sap-icon://account",
			type: "Navigation",
			adaptTitleSize: true,
			press: function() {
				oRouter.navTo("profile");
			}
		});
		var accountList = new sap.m.List({
			headerText: "Account",
			items: [
				oAccountListItem
			]
		});

		var masterPage = new sap.m.semantic.MasterPage({
			id: "masterPage",
			title: "Menu",
			showFooter: false,
			content: [
				dashboardList,
				appList,
				accountList
			]
		});

		return masterPage;
	}

});