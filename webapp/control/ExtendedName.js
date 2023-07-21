/*!
 * SAPUI5
 * (c) Name that needs to follow certain validation
 */

sap.ui.define([
	"sap/ui/model/odata/type/String",
	"sap/ui/model/ValidateException"
], function (String, ValidateException) {
	"use strict";

	var StringExtended = String.extend("aklc.type.ExtendedName");

	/**
	 * Validates whether the given value in model representation is valid and meets the
	 * defined constraints.
	 *
	 * @param {string} sValue
	 *   the value to be validated
	 * @throws {sap.ui.model.ValidateException} if the value is not valid
	 * @public
	 */
	StringExtended.prototype.validateValue = function (sValue) {
		String.prototype.validateValue.call(this, sValue);
		let _sValue = sValue.trim();
		_sValue.length === 0 ? this._throwException("Enter a valid value and not only spaces.") : sValue.length; 
		_sValue.length < 4 ? this._throwException("Enter a valid value more then 4 characters minimum.") : sValue.length; 
		
	};
	StringExtended.prototype._throwException = function (sMsg){
		throw new ValidateException(sMsg);
	},

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 *   the type's name
	 * @public
	 */
	StringExtended.prototype.getName = function () {
		return "aklc.type.ExtendedName";
	};

	return StringExtended;
});