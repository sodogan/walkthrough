sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "./model/models",
    "./model/DeviceModel",
    "sap/ui/model/BindingMode",
    "./utils/ErrorHandler",
    "./control/ExtendedName",
    "thirdparty/lodash/lodash",
    "thirdparty/moment/moment"
], function (UIComponent, JSONModel, Device, models, DeviceModel, BindingMode, ErrorHandler) {
    "use strict";

    return UIComponent.extend("sap.ui.demo.walkthrough.Component", {

        metadata: {
            manifest: "json"
        },
        //Application State
        //Any time there is any changes this model will be used
        _applicationState: {
            hasError: false,
            hasPendingChanges: false,
            errorCount: 0
        },
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this._deviceModel = new DeviceModel(this, Device, BindingMode.OneWay)
            this._deviceModel.setModel("device");
            //set the overall application state model here
            this.setModel(this.createApplicationStateModel(), "appState");

            //Create the error handler
            this._oErrorHandler = new ErrorHandler(this);

            // create the views based on the url/hash
            this.getRouter().initialize();

            //Set the thirdparty library for all controllers 
            //This does not work in fiori but works in ui5            
            //set the lodash
            if (!this._moment) {
                this._moment = moment();
            }
            if (!this._lodash) {
                this._lodash = _;
            }
        },
        getMoment: function () {
            return this._moment;
        },
        getLodash: function () {
            return this._lodash;
        },
        //get  the application state
        createApplicationStateModel: function () { // General Component related Data - Error Handeling , FileAPI Path etc 
            return new JSONModel(this._applicationState);
        },

        //in order to return the error handler object to outside!
        getErrorHandler: function () {
            return this._oErrorHandler;
        },
        /**
         * The component is destroyed by UI5 automatically.
         * In this method, the ListSelector and ErrorHandler are destroyed.
         * @public
         * @override
         */
        destroy: function () {

            this._oErrorHandler.destroy();

            // call the base component's destroy function
            UIComponent.prototype.destroy.apply(this, arguments);
        },
        /**
        * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
        * design mode class should be set, which influences the size appearance of some controls.
        * @public
        * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
        */
        getContentDensityClass: function () {
            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                // eslint-disable-next-line sap-no-proprietary-browser-api
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }



    });

});


