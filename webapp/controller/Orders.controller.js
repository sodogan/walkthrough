sap.ui.define(
    ["./BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        'sap/ui/model/json/JSONModel',
        "sap/m/UploadCollectionParameter",
        "sap/m/MessageToast",
        "sap/m/library",
        "./ListReportControllerExtension",
        'sap/ui/core/mvc/OverrideExecution'
    ],
    function (BaseController, Filter, FilterOperator, JSONModel, UploadCollectionParameter, MessageToast, library, ListReportControllerExtension,OverrideExecution) {

        const ListMode = library.ListMode;
        const ListSeparators = library.ListSeparators;

        return BaseController.extend('sap.ui.demo.walkthrough.controller.Orders', {

            metadata: {
                "abstract" : false,
                stereotype: "controller",
                methods: {
                    "onInitSmartFilterBarExtension": { "public": true, "final": false, "overrideExecution": OverrideExecution.After },//can be overridable
                    "onBeforeRebindTableExtension": { "public": true, "final": false  }

                }
            },

            extensionAPI: ListReportControllerExtension,
            uploadTemplate: {
                "maximumFilenameLength": 55,
                "maximumFileSize": 1000,
                "mode": ListMode.SingleSelectMaster,
                "uploadEnabled": true,
                "uploadButtonVisible": true,
                "enableEdit": true,
                "enableDelete": true,
                "visibleEdit": true,
                "visibleDelete": true,
                "listSeparatorItems": [
                    ListSeparators.All,
                    ListSeparators.None
                ],
                "showSeparators": ListSeparators.All,
                "listModeItems": [
                    {
                        "key": ListMode.SingleSelectMaster,
                        "text": "Single"
                    }, {
                        "key": ListMode.MultiSelect,
                        "text": "Multi"
                    }
                ]
            },
            onInit: function () {
                // call the init function of the parent
                BaseController.prototype.onInit.apply(this, arguments);
                //register for failures _metadataFailedHandler
                //get the error handler here
                let _oErrorHandler = this.getErrorHandler();
                let oView = this.getView();

                //Now try to listen the 
                let setBusyState = bFlag => {
                    debugger;
                    let _appViewModel = this.getModel("appView");
                    let _originalDelay = this.getView().getBusyIndicatorDelay();
                    _appViewModel.setProperty("/busy", bFlag);
                    _appViewModel.setProperty("/delay", _originalDelay);
                };
                let _setAppStateHandler = response => {
                    debugger;
                    console.log(response);
                    setBusyState(false);
                };

                //set the callback to add a callback if there is any extra cleanup to do like set the busy state to false!
                _oErrorHandler.setCallback(_setAppStateHandler);

                oView.setModel(new JSONModel(this.uploadTemplate), "upload");

                debugger;

                //get the lodash library
                let lodashUtil = this.getLodash();

                //get the moment library
                let momentLibrary = this.getMoment();


            },
            //This method is overriden by the extension API
            onInitSmartFilterBarExtension: function () {
                debugger;
            },
            //This method is overriden by the extension API
            onBeforeRebindTableExtension: function (oEvent) {
                debugger;
            },
            onBeforeUploadStarts: function (oEvent) {
                // Header Slug
                debugger;
                var oCustomerHeaderSlug = new UploadCollectionParameter({
                    name: "slug",
                    value: oEvent.getParameter("fileName")
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
                MessageToast.show("BeforeUploadStarts event triggered.");

                // Sets the text to the label
                let oUploadCollection = sap.ui.getCore().byId("UploadCollection");
                if (oUploadCollection) {
                    oUploadCollection.addEventDelegate({
                        onBeforeRendering: function () {
                            debugger;
                            let _title = this.getAttachmentTitleText();
                            this.byId("attachmentTitle").setText(_title);
                        }.bind(this)
                    });
                }

            },
            getAttachmentTitleText: function () {
                let oUploadCollection = this.byId("UploadCollection");
                let aItems = oUploadCollection.getItems();
                return "Uploaded (" + aItems.length + ")";
            },
            onUpload: async function (oEvent) {
                debugger;
                const oSourceControl = oEvent.getSource();

                let oView = this.getView();
                //get the utility object
                let utility = this.getUtility();
                let sFragmentName;

                if (!this._oMultiFileDialog) {
                    sFragmentName = "sap.ui.demo.walkthrough.fragment.MultiFileUploadDialog";
                    this._oMultiFileDialog = await utility.loadFragmentAsPromise(sFragmentName);
                }
                debugger;
                oView.addDependent(this._oMultiFileDialog);
                this._oMultiFileDialog.open(oSourceControl);
            },
            //Start uploading process
            onStageDocuments: async function () {
                debugger;

                let oUploadCollection = sap.ui.getCore().byId("UploadCollection");
                if (oUploadCollection) {
                    debugger;
                    var cFiles = oUploadCollection.getItems().length;
                    if (cFiles > 0) {
                        let uploadInfo = cFiles + " file(s)";

                        oUploadCollection.upload();
                        MessageToast.show("Method Upload is called (" + uploadInfo + ")");
                        MessageBox.information("Uploaded " + uploadInfo);
                    }

                }

            },
            onFileDeleted: function (oEvent) {
                MessageToast.show("Event fileDeleted triggered");
            },

            onFilenameLengthExceed: function (oEvent) {
                MessageToast.show("Event filenameLengthExceed triggered");
            },

            onFileSizeExceed: function (oEvent) {
                MessageToast.show("Event fileSizeExceed triggered");
            },

            onTypeMissmatch: function (oEvent) {
                MessageToast.show("Event typeMissmatch triggered");
            },
            onCloseMultiFileUploadDialog: function () {
                this._oMultiFileDialog.close();
            },
            //for the smarttable
            onInitialize: function () {

            },
            //for the smarttable
            onBeforeRebindConditionTable: function () {

            },
            onFilterInvoices: function (oEvent) {
                debugger;

                if (oEvent.getParameters().query) {
                    squery = oEvent.getParameters().query;
                    //first get the binding
                    const oList = this.getView().byId('invoiceList');

                    //get the bindings
                    const _binding = oList.getBinding('items');

                    //filter
                    const _filters = [new Filter("ProductName", FilterOperator.Contains, squery)];

                    _binding.filter(_filters);

                }

            },
            onOrderSelect: function (oEvent) {
                debugger;
                //get the item
                let _columListItem = oEvent.getSource();
                let _sPath = _columListItem.getBindingContextPath();
                //remove the slash
                //and add the employee
                let _orderID = _columListItem.getBindingContext().getObject().OrderID;

                // let  _fullPath = _sPath.substr(1) +"/employee/"+ _employeeID;
                this.getRouter().navTo("orderDetails", {
                    orderId: _orderID
                });

            },
            onTest: function (oEvent) {
                debugger;
            }


        });




    });