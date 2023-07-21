sap.ui.define([
    "./DefaultModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/BindingMode",
    "sap/ui/Device"
], function (DefaultModel, JSONModel, BindingMode, Device) {
    'use strict';


    const deviceModel = DefaultModel.extend("sap.ui.demo.walkthrough.model.DeviceModel", {
          
        
        /** @param {oComponent}
         * 
         */
        constructor: function (oComponent,oModel, oBindingMode) {
            //call the supe class here
            DefaultModel.prototype.constructor(oComponent,Device,BindingMode.OneWay);
           
        }

    });

    return deviceModel;

});