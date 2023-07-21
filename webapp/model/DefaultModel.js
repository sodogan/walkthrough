sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/BindingMode",
    "sap/base/assert"
], function (Object, JSONModel, BindingMode, assert) {
    'use strict';

    const DefaultModel = Object.extend("sap.ui.demo.walkthrough.model.DefaultModel", {

        constructor: function (oComponent, oModel, oBindingMode) {
            assert(!oComponent || typeof (oComponent) === "object", "DefaultModel.constructor: oCompomnent can not be empty");
            this._oComponent = oComponent;
            this._model = new JSONModel(oModel);
            this._model.setDefaultBindingMode(!oBindingMode ? BindingMode.OneWay : oBindingMode);
            //private field-will not be inherited
            this.mVersion = {};
        }

    });

    //private and will not be available in the base class 
    DefaultModel.mVersion = [1, 2, 3];

    DefaultModel.prototype.getModel = function () {
        return this._model;
    };

    DefaultModel.prototype.setModel = function (sModelName) {
        this._oComponent.setModel(this._model, sModelName);
    };

    return DefaultModel;

});