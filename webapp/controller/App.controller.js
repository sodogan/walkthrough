sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.walkthrough.controller.App", {

		appViewSettings: {
			busy: true,
			delay: 0
		},

		onInit: function () {

			debugger;
			 // call the init function of the parent
			 BaseController.prototype.onInit.apply(this, arguments);

			const appViewModel = new JSONModel(this.appViewSettings);
			this.setModel(appViewModel, "appView");

			//Now try to listen the 
			let setBusyState = bFlag => {
				debugger;
				let _appViewModel = this.getModel("appView");
				let _originalDelay = this.getView().getBusyIndicatorDelay();
				_appViewModel.setProperty("/busy", bFlag);
				_appViewModel.setProperty("/delay", _originalDelay);
			};

		 
			//Set the state to false when metadata is loaded!
			this.getOwnerComponent().getModel().metadataLoaded()
				.then(oData=> {
					debugger;
					// Now set the busy state
					setBusyState(false);
				}
			);


		},
		loadMetadata: async function () {
			// let _setBusyState = function () {
			// 	let _appViewModel = this.getModel("appView");
			// 	let _originalDelay = this.getView().getBusyIndicatorDelay();
			// 	_appViewModel.setProperty("/busy", false);
			// 	_appViewModel.setProperty("/delay", _originalDelay);
			// }.bind(this);
			let _oDataModel = this.getOwnerComponent().getModel();

			let _metadataLoad = oDataModel.metadataLoaded();
			debugger;
			await _metadataLoad;

			debugger;
			_setBusyState();


			oDataModel.attachMetadataFailed((oError) => {
				debugger;
			});

		}
	});

});