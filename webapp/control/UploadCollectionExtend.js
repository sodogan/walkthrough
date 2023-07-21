sap.ui.define(
    [
     "sap/m/UploadCollection",
     "sap/m/MessageBox"
     ], function(UploadCollection, MessageBox) {
    "use strict";
    return UploadCollection.extend("sap.ui.demo.walkthrough.control.UploadCollectionExtend", {
        init: function () {

            UploadCollection.prototype.init.apply(this, arguments);
        },

        /*The below method is a copy of "UploadCollection" class with minor tweaks
        to accomodate drag and drop as well as filereading in bulk */
        _onDropOnUploadCollection: function (event) {
            event.originalEvent.dataTransfer.dropEffect = "copy";
            if (!this._checkForFiles(event)) {
                // In Firefox the drop event leads to the opening of an invalid URL. Therefore we need to prevent this behaviour
                event.preventDefault();
                return;
            }
            if (event.target === this._$DragDropArea[0]) {
                event.preventDefault();
                this._$DragDropArea.removeClass("sapMUCDropIndicator");
                this._$DragDropArea.addClass("sapMUCDragDropOverlayHide");
                this.getAggregation("_dragDropText").setText(this._oRb.getText("UPLOADCOLLECTION_DRAG_FILE_INDICATOR"));
                var aFiles = event.originalEvent.dataTransfer.files;
                // multiple files are not allowed to drop when multiple is false
                if (aFiles.length > 1 && !this.getMultiple()) {
                    var sMessage = this._oRb.getText("UPLOADCOLLECTION_MULTIPLE_FALSE");
                    MessageBox.error(sMessage);
                    return;
                }
                // files are not allowed to drop if they do not comply the FileUploader's restrictions
                if (!this._oFileUploader._areFilesAllowed(aFiles)) {
                    return;
                }
                /*This block has been changed to accomodate reading all files at once */
                if (!this.getInstantUpload()) {
                    this._oFileUploader.fireChange({
                        files: aFiles,
                        fromDragDrop: true
                    });
                    for (var i = 0; i < aFiles.length; i++) {
                        this._aFilesFromDragAndDropForPendingUpload.push(aFiles[i]);
                    }
                    /*End of change*/
                } else {
                    // fire the _onchange event so that the UC item could be created
                    this._oFileUploader.fireChange({
                        files: aFiles
                    });
                    this._oFileUploader._sendFilesFromDragAndDrop(aFiles);
                }
            }
        },
        _onDragOverUIArea: function (n) {
            n.originalEvent.dataTransfer.dropEffect = "copy";
            UploadCollection.prototype._onDragOverUIArea.apply(this, arguments);
        },
        _onDragOverOnUploadCollection: function (n) {
            n.originalEvent.dataTransfer.dropEffect = "copy";
            UploadCollection.prototype._onDragOverOnUploadCollection.apply(this, arguments);
        },
        renderer: "sap.m.UploadCollectionRenderer"
    });
});