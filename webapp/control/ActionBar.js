sap.ui.define(["sap/ui/ux3/ActionBar", "sap/ui/ux3/ActionBarRenderer"],
	function(UX3ActionBar, UX3ActionBarRenderer) {
		"use strict";
		return UX3ActionBar.extend("sap.ui.demo.walkthrough.control.ActionBar", {
			metadata: {
				aggregations: {
					_businessActionButtons: {
						type: "sap.m.Button",
						multiple: true,
						singularName: "businessActionButton"
					}
				}
			},
			renderer: UX3ActionBarRenderer.render
		});
	}, /* bExport= */ true);
