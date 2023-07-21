sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageBox"
], function (Object, MessageBox) {
    "use strict";

    return Object.extend("sap.ui.demo.walkthrough.utils.ErrorHandler", {

        /**
         * Handles application errors by automatically attaching to the model events and displaying errors when needed.
         * @class
         * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
         * @public
         * @alias nz.govt.aklc.zrcmonitoring.controller.ErrorHandler
         */
        constructor: function (oComponent) {
            this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
            this._oComponent = oComponent;
            this._bMessageOpen = false;
            this._oModel = oComponent.getModel();
            this._oModel.attachMetadataFailed(this._metadataFailedHandler, this);
            this._oModel.attachBatchRequestFailed(this._requestFailedHandler, this);
            this._oModel.attachRequestFailed(this._requestFailedHandler, this);
            this._sErrorText = this._oResourceBundle.getText("errorText");

        },
        /** 
        * Set Alternative Callback when errors occurs ( Normally integrated to View )
        * @public
        */
        setCallback: function (fCallback) { // Setup Callback for all errors
            this.fCallback = fCallback;
        },
        _requestFailedHandler: function (oEvent) {
            var oParams = oEvent.getParameters();
            // An entity that was not found in the service is also throwing a 404 error in oData.
            // We already cover this case with a notFound target so we skip it here.
            // A request that cannot be sent to the server is a technical error that we have to handle though
            if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)) {

                if (this.fCallback !== undefined) {
                    this.fCallback(oParams.response);  // We have a callback setup use it instead than an Ugly Popup!
                }
                else {
                    this._showServiceError(oParams.response);
                }
            }

        },

        _metadataFailedHandler: function (oEvent) {
            var oParams = oEvent.getParameters();
            //This way allow users to set callback to do cleanup operations
            if (this.fCallback !== undefined) {
                this.fCallback(oParams.response);  // We have a callback setup use it instead than an Ugly Popup!
            }
            this._showServiceError(oParams.response);
        },



        /**
         * Shows a {@link sap.m.MessageBox} when a service call has failed.
         * Only the first error message will be display.
         * @param {string} sDetails a technical error to be displayed on request
         * @private
         */
        _showServiceError: function (sDetails) {
            if (this._bMessageOpen) {  // ZZ Do we want to allow messages to be shown
                return;
            }
            this._bMessageOpen = true;
            MessageBox.error(
                this._sErrorText,
                {
                    id: "serviceErrorMessageBox",
                    details: sDetails,
                    styleClass: this._oComponent.getContentDensityClass(),
                    actions: [MessageBox.Action.CLOSE],
                    onClose: function () {
                        this._bMessageOpen = false;
                    }.bind(this)
                }
            );
        }//end 



    });

});