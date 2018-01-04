sap.ui.jsview("mm.view.launchpad", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf mm.view.launchpad
	 */
	getControllerName: function() {
		return "mm.controller.launchpad";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away. 
	 * @memberOf mm.view.view.launchpad
	 */
	createContent: function(oController) {
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData('model/apps.json', "", false);
		var genericTileData = oModel.getProperty("/apps");

		// var oHeaderContent = new sap.ui.core.Control();
		var oAccount = new sap.m.Button({
			id: "btnAccountId",
			icon: "sap-icon://account",
			type: "Transparent",
			press: [oController.onAccountPress, oController]
		});
		
		// oAccount.attachPress("onAccountPress");
		var oPage = new sap.m.Page({
			title: "{i18n>appTitle}",
			headerContent: [oAccount],
			content: []
		});

		var app = new sap.m.App("myApp", {
			initialPage: "oPage"
		});

		if (genericTileData instanceof Array) {
			for (var i = 0; i < genericTileData.length; i++) {
				oPage.addContent(this.generateTile(genericTileData[i]));
			}
		}

		app.addPage(oPage);
		return app;
	},

	generateTile: function(app) {
		
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var tileContent;
		var nullifyValue = false;
		
		if (app.image !== undefined) {
			tileContent = new sap.m.ImageContent({
				src: app.image
			});
		} else {
			if (app.value !== undefined) {
				nullifyValue = true;
			}

			tileContent = new sap.m.NumericContent({
				icon: "sap-icon://" + app.icon,
				scale: app.scale,
				value: app.value,
				nullifyValue: nullifyValue,
				valueColor: app.valueColor,
				indicator: app.indicator
			});
		}

		return new sap.m.GenericTile({
			header: app.header,
			subheader: app.subheader,
			tileContent: [new sap.m.TileContent({
				footer: app.footer,
				unit: app.unitFooter,
				content: [tileContent]
			})],
			press: function() { 
				oRouter.navTo(app.routeName);				
			}
		}).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop");
	}

});