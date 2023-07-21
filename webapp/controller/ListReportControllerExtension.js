/***
@controller Name:sap.suite.ui.generic.template.ListReport.view.ListReport,
*@viewId:ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ListReport.view.ListReport::C_PurchaseOrderTP
*/
/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
	'sap/ui/core/mvc/ControllerExtension',
	'sap/ui/core/mvc/OverrideExecution'
],
	function (
        Controller,
		ControllerExtension,
		OverrideExecution
	) {
		"use strict";
		return ControllerExtension.extend("sap.ui.demo.walkthrough.controller.ListReportControllerExtension", {
			metadata: {
				// extension can declare the public methods
				// in general methods that start with "_" are private
				methods: {
					publicMethod: {
						public: true /*default*/ ,
						final: false /*default*/ ,
						overrideExecution: OverrideExecution.Instead /*default*/
					},
					finalPublicMethod: {
						final: true
					},
					onMyHook: {
						public: true /*default*/ ,
						final: false /*default*/ ,
						overrideExecution: OverrideExecution.After
					},
					couldBePrivate: {
						public: false
					}
				}
			},

			publicMethod: function (){},
			finalPublicMethod: function (){},
			onMyHook: function (){},
			couldBePrivate: function (){},

			// // adding a private method, only accessible from this controller extension
			// _privateMethod: function() {},
			// // adding a public method, might be called from or overridden by other controller extensions as well
			// publicMethod: function() {},
			// // adding final public method, might be called from, but not overridden by other controller extensions as well
			// finalPublicMethod: function() {},
			// // adding a hook method, might be called by or overridden from other controller extensions
			// // override these method does not replace the implementation, but executes after the original method
			// onMyHook: function() {},
			// // method public per default, but made private via metadata
			// couldBePrivate: function() {},
			// // this section allows to extend lifecycle hooks or override public methods of the base controller
			override: {
				/**
				 * Called when a controller is instantiated and its View controls (if available) are already created.
				 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
				 * @memberOf customer.manage.orders.variant.ListReportExtensionController
				 */
				onInit: function () {
					debugger;
				},

				/**
				 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
				 * (NOT before the first rendering! onInit() is used for that one!).
				 * @memberOf customer.manage.orders.variant.ListReportExtensionController
				 */
				onBeforeRendering: function () {
					debugger;
				},

				/**
				 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
				 * This hook is the same one that SAPUI5 controls get after being rendered.
				 * @memberOf customer.manage.orders.variant.ListReportExtensionController
				 */
				onAfterRendering: function () {
					debugger;
				},

				/**
				 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
				 * @memberOf customer.manage.orders.variant.ListReportExtensionController
				 */
				onExit: function () {
				},

				// override public method of the base controller
				onInitSmartFilterBarExtension: function () {
					debugger;
				},

				onBeforeRebindTableExtension: function (oEvent) {
					debugger;
					let oBindingParams = oEvent.getParameter("bindingParams");
					oBindingParams.parameters = oBindingParams.parameters || {};

					let oSmartTable = oEvent.getSource();
					//get the Filter
					let oSmartFilter = this.getView().byId("listReportFilter");
					let oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());

					//TransactionId is key field 
					var oFilter = new sap.ui.model.Filter({
						path: "CompanyCode",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: "1000"
					});

					var aFilter = [];
					if (parameter) {
						aFilter.push(oFilter);
					}
					//push a new filter in here
					oSmartFilter.getControlByKey("CompanyCode").getBinding("items").filter(aFilter);

				}
			}
		});
	});