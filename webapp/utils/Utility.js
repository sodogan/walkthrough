sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function (Object, Fragment,MessageBox) {
    'use strict';

    return Object.extend("sap.ui.demo.walkthrough.utils.Utilities", {
       
        /**
         * Utility class
         * constructor
         * @param {sap.ui.core.UIComponent} oController reference to the app's component
         * @public
         * @alias sap.ui.demo.walkthrough.utils.Utilities
         */
        constructor: function (oController) {
            Object.call(this);//call the superclass
            this._oController = oController;
        },
         /**
         * Load fragment as a promise in Async-can use await
         * constructor
         * @param {sap.ui.core.UIComponent} oController reference to the app's component
         * @public
         * @alias sap.ui.demo.walkthrough.utils.Utilities
         */
        loadFragmentAsPromise: async function (sName, sId) {
            return new Promise((resolve, reject) => {
                Fragment.load({
                    name: sName,
                    id: sId,
                    controller: this._oController

                }).then((oFragment) => {
                    resolve(oFragment);
                }).catch((error) => {
                    reject(error);
                });
            });
        },
        _confirm: async function (sMsg) {
			return new Promise(function (resolve, reject) {
				MessageBox.confirm(sMsg, {
					title: "Confirm",
					onClose: function (e) {
						if (e === MessageBox.Action.OK) {
							resolve(e);
						} else {
							reject(e);
						}
					},
					styleClass: ""
				});
			});
		},
        readODataPath: function (oDataModel, _sPath) {
            return new Promise(function (resolve, reject) {
                oDataModel.read(_sPath, {
                    success: function (result) {
                        //Now here we need to bind the data to the table!
                        resolve(result);
                    },
                    error: function (error) {
                        console.log(error);
                        reject(error);
                    }
                });


            });

        } 

    
    });



});