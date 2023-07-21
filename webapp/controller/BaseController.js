sap.ui.define([
    "sap/ui/core/mvc/Controller",
    '../model/formatter',
    '../utils/Utility',
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/ui/core/message/ControlMessageProcessor",
    'sap/ui/core/mvc/OverrideExecution'
], function (Controller, formatter, Utility, _Fragment, History, ControlMessageProcessor, _OverrideExecution) {
    'use strict';

    //common functions here
    let BaseController = Controller.extend("sap.ui.demo.walkthrough.controller.BaseController",
        {
            // metadata: {
            //     "abstract" : false,
            //     stereotype: "controller",
            //     methods: {
            //         "getPrivate": { "public": false, "final": false, "overrideExecution": OverrideExecution.After },//can be overridable
            //         "getUtility": { "public": true, "final": false  },
            //         "getBaseModel": { "public": true, "final": false },
            //         "getResourceBundle": { "public": true, "final": false },
            //         "getMessageManager": { "public": true, "final": true },
            //         "getText": { "public": true, "final": false },
            //         "getErrorHandler": { "public": true, "final": true },
            //         "getRouter": { "public": true, "final": true },
            //         "hasErrorMessages": { "public": true, "final": true },
            //         "getAppStateModel": { "public": true, "final": true },
            //         "getModel": { "public": true, "final": true }

            //     }
            // },
            formatter: formatter,
            //lifecycle Method
            onInit: function () {
                debugger;
                //create the utility   
                if (!this._utility) {
                    this._utility = new Utility(this);
                }
            },
            /**
            * Convenience method for getting the view model by name in every controller of the application.
            * @public
            * @param {string} sModelName the model name
            * @returns {sap.ui.model.Model} the model instance
            */
            getModel: function (sModelName) {
                return this.getView().getModel(sModelName);
            },
            /**
            * Convenience method for setting the view model in every controller of the application.
            * @public
            * @param {sap.ui.model.Model} oModel the model instance
            * @param {string} sName the model name
            */
            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            /**
               * Get Base/Global Model
               * @public
               * @param {string} sModelName the model name
               * @returns {sap.ui.model.resource.ResourceModel} 
               */
            getBaseModel: function (sModelName) {
                return this.getOwnerComponent().getModel(sModelName);
            },
            /**
              * Convenience method for getting the resource bundle.
              * @public
              * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
              */
            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },
            /**
             * Convenience method for accessing the router in every controller of the application.
             * @public
             * @returns {sap.ui.core.routing.Router} the router for this component
             */
            getRouter: function () {
                return this.getOwnerComponent().getRouter();
            },
            /** 
             * Get the text from i18n
             * @public
             * @param {string} sTextName the text
            */
            getText: function (sTextName) {
                return this.getResourceBundle().getText(sTextName);
            },
            /** 
            * Register Message Manager
            * @private  
            */
            registerMessageManager: function () {

                this.getMessageManager().registerMessageProcessor(new ControlMessageProcessor());
            },
            /**
             * Convenience method for clearing out all messages 
             * @public
             */
            clearAllMessages: function () {
                //clear out the message manager
                let oMessageManager = this.getMessageManager();
                oMessageManager.removeAllMessages();
            },
            /**
             * Convenience method for accessing the MessageManager in every controller of the application.
             * @public
             */
            getMessageManager: function () {
                return sap.ui.getCore().getMessageManager();
            },
            hasErrorMessages: function () {
                let oMessageManager = this.getMessageManager();
                //check if there is any messages
                return oMessageManager.getMessageModel().getData().length > 0 ? true : false;

            },
            getUtility: function () {
                return this._utility;
            },
            //in order to return the error handler object to outside!
            getErrorHandler: function () {
                return this.getOwnerComponent().getErrorHandler();
            },

            getAppStateModel: function () {
                return this.getBaseModel("appState")
            },


            onModelHasChange: function (_oEvent) {

                //Now we can do set that there is a change happening
                //get the appstate model and set the hasPending to true
                let _appStateModel = this.getAppStateModel();

                const stateData = _appStateModel.getData();
                //set the property to true
                _appStateModel.setProperty("/hasPendingChanges", true);

            },
            onNavBack: function () {
                let oHistory, sPreviousHash;

                oHistory = History.getInstance();
                sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("orders", {}, true /*no history*/);
                }
            }

        });



    return BaseController;



});