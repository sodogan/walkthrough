sap.ui.define(
    [
        "./BaseController",
        "sap/m/ColumnListItem",
        "sap/m/Text",
        "sap/ui/model/Binding",
        'sap/ui/model/json/JSONModel',
        '../model/formatter',
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    function (BaseController, ColumnListItem, Text, Binding, JSONModel, formatter, Filter, FilterOperator) {

        return BaseController.extend('sap.ui.demo.walkthrough.controller.OrderDetails', {

            viewKey: {
                orderID: undefined
            },
            //Override the Base Controller method
            getUtility: function () {
                debugger;
                //call the base class
                let utility = BaseController.prototype.getUtility.apply(this, arguments)
                return utility;
            },
            onInit: function () {

                debugger;
                // call the init function of the parent
                BaseController.prototype.onInit.apply(this, arguments);

                let oView = this.getView();
                let oMessageManager = this.getMessageManager();
                //this.registerMessageManager();
                oView.setModel(oMessageManager.getMessageModel(), "message");
                //register the message manager to listen to the UI errors
                oMessageManager.registerObject(oView, true);
                // Route handler
                const _routeMatchedHandler = (oEvent) => {
                    //get the parameters
                    let orderID = oEvent.getParameters().arguments.orderId;
                    //set the key
                    if (this.viewKey.orderID === "undefined" || this.viewKey.orderID != orderID) {
                        this.viewKey.orderID = orderID;
                    }

                    let _decodedOrderPath = "/" + "Orders" + "(" + window.decodeURI(orderID) + ")";


                    //Bind the view itself
                    //When the view gets loaded then bind the employee
                    oView.bindElement({
                        path: _decodedOrderPath,
                        parameters: { expand: 'Order_Details,Employee', groupId: "" }, // Group id as blank allows us to batch on the standard Change Group
                        events: {
                            dataRequested: () => {
                            },
                            dataReceived: function (oData) {
                                debugger;
                                //bind the employee details
                                _bindEmployeeDetails();
                                //attach the changes 
                                this.attachOnChange();
                                // _oOrderDetailsTable.setTableBindingPath(_decodedDetailPath);
                                // this.busyDialogUtil.close();
                                //set the binding context here
                                // let _context = this.oView.getBindingContext();
                                //_oDetailsTable.setBindingContext(_context,"");
                            }.bind(this)
                        }
                    });

                    //Bind the employee details
                    let _bindEmployeeDetails = () => {
                        let _oEmployeeDetails = this.byId("oEmployeeDetails");

                        _oEmployeeDetails.bindElement({
                            path: _decodedOrderPath + "/Employee",
                            // parameters: { groupId: "", expand: 'to_Condition,to_FormData,to_Partner' },
                            events: {
                                dataRequested: () => {
                                    // this.busyDialogUtil.open("", "");
                                },
                                dataReceived: (oData) => {
                                    debugger;

                                    // this._afterRebindComplete(bForceRefresh, oData);//Post data refresh activities
                                    // if (bForceRefresh) {
                                    // await this._initControls();
                                    // await this._generateFormData();
                                    // await this._bindAttachments();
                                    // bForceRefresh = false;
                                    // }
                                    // this.busyDialogUtil.close();
                                }
                            }
                        });
                    };

                };


                //get the router and bind the page to that 
                const oRouter = this.getRouter();
                oRouter.getRoute('orderDetails').attachPatternMatched(_routeMatchedHandler);

            },
            //To attach changes if any data changes on the UI this will be triggering
            attachOnChange: function () {
                debugger;
                let oView = this.getView();
                let oModel = oView.getModel();
                let oElementBinding = oView.getElementBinding();
                let oElementBindingPath = oElementBinding.getPath();
                let oElementBindingContext = oElementBinding.getBoundContext();

                let oBinding = new Binding(oModel, oElementBindingPath, oElementBindingContext);
                //Attach for the changes 
                oBinding.attachChange(function () {
                    debugger;
                    this.onModelHasChange();
                }.bind(this));

            },

            /**  When SmartField is created we want to add a Live change event if available. This will allow us to detect
            *  any input so we can show the save button. Otherwise the user has to fire the onchange event 
            * @param oEvent The child control of the smart control we will add the live change event to
            * @public
            */
            onSmartFieldInnerControlsCreated: function (oEvent) {  // Add LiveChange event so we can get Pending Changes on Entry
                debugger;
                if (oEvent.getParameters().length === 0) return true;
                //Attach live change event for listening any changes
                if (oEvent.getParameters()[0].attachLiveChange) { // If we have a live change event bind it
                    oEvent.getParameters()[0].detachLiveChange(this.onModelHasChange.bind(this));
                    oEvent.getParameters()[0].attachLiveChange(this.onModelHasChange.bind(this));
                }


            },
            onBeforeRebindOrderDetailsTable: function (oEvent) {
                debugger;
                // const oBindingParams = oEvent.getParameter("bindingParams");
                // const _orderIDfilter =  new Filter({
                //     path: "OrderID",
                //     operator: FilterOperator.EQ,
                //     value1: this.viewKey.orderID
                // });
                // oBindingParams.filters.push(_orderIDfilter);  // Filter by ConsentBanGuid
            },

            onValidationError: function (oEvent) {
                debugger;
                const _oSourceControl = oEvent.getSource();
                _oSourceControl.setValueState("Error");
            },
            onMessagePopoverPress: async function (oEvent) {
                debugger;
                let oSourceControl = oEvent.getSource();
                let oView = this.getView();
                //get the utility object
                let utility = this.getUtility();
                let  sFragmentName;
           
                 debugger;  
                //load it as a promise for later on
                if (!this._oMessagePopOver) {
                    sFragmentName = "sap.ui.demo.walkthrough.fragment.MessagePopover";
                    this._oMessagePopOver = utility.loadFragmentAsPromise(sFragmentName);
                }

                //open the message poo over
                this._oMessagePopOver
                    .then((oMessagePopover) => {
                        oView.addDependent(oMessagePopover);
                        oMessagePopover.openBy(oSourceControl);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            },
            _bindOrderDetailsTable: function () {
                let _oDetailsTable = this.byId("oOrderDetailsTable");

                // let  oTextOrderID = new Text({
                //     text: "{path:'OrderID', formatter:'.myGenderFormatter'} {firstName} {lastName}"
                // });
                let createCells = function () {
                    let oTextOrderID = new Text({
                        text: "{path:'OrderID'}"
                    });
                    let oTextProductID = new Text({
                        text: "{path:'ProductID'}"
                    });

                    let oTextQuantity = new Text({
                        text: "{path:'Quantity'}"
                    });

                    const cells = [oTextOrderID, oTextProductID, oTextQuantity];
                    return [...cells];
                }


                let oColumnListItemTemplate = new ColumnListItem({
                    cells: createCells()
                });
                //bind the table here
                _oDetailsTable.bindItems({
                    path: _decodedDetailPath,
                    template: oColumnListItemTemplate,
                    templateShareable: true
                    // filters : aFilters,
                    // sorter : this.aSorterEqui
                });

            },
            onBeforeRendering: function () {
                debugger;

            },
            onAfterRendering: function () {

            },
            _hasSaveError: function () {

                let bHasError = false;
                var aControls = this.getView().getControlsByFieldGroupId("General"); // Get Controls from General Group 

                aControls.forEach(function (oControl) {
                    if (oControl.getFirstInnerControl) {
                        if (oControl.getFirstInnerControl().getValueState) {
                            if (oControl.getFirstInnerControl().getValueState() === 'Error') {  // Does any of these controls have an error then we abort Saving
                                bHasError = true;

                            }
                        }
                    }

                });
                return bHasError;
            },
            _savePromise: function () {
                let promise = new Promise((resolve, reject) => {
                    if (this._hasSaveError() === true) {
                        reject({ customMessage: "Some Fields are still in Error. Please fix and save again" });
                    } else {
                        this.clearAllMessages(); // Make sure we have no error messages showing
                        var oModel = this.getBaseModel();
                        //submit the changes 
                        oModel.submitChanges({
                            groupId: "changes", success: (oData) => { // Changes is the standard Group when you don't specify one. So all changes FYI
                                debugger;
                                // this.refreshElementBinding();
                                // this.msgUtil.showSuccessMessage(this.getText('saveComplete'));
                                resolve(oData);
                            }, error: (oError) => {
                                debugger;
                                reject(oError);
                            }
                        });
                    }

                });
                return promise;
            },
            //Save the changes with the ODATA
            onSave: async function (oEvent) {
                debugger;
                //make sure that there is no UI errors before saving!
                if (!this._hasSaveError()) {
                    await this._savePromise();
                }
                else {
                    //inform user that there are errors on the UI
                }
            },

            //revert all the changes
            onRevert: function (oEvent) {
                debugger;
                let oView = this.getView();

                //reset the changes
                oView.getModel().resetChanges();
                //clear out the message manager
                this.clearAllMessages();

            },
            onInformationButtonPressed: function (oEvent) {
                debugger;
            },
            onOpenRUX(oEvent) {

                var eventBus = sap.ui.getCore().getEventBus();  // Condition page will pick this up and close if open
                eventBus.publish("Condition", "close", {});

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: "ZRUX_OVW-display&/ApplicationSet(guid'" + this.viewKey.BundleGuid + "')"
                    }
                });

            }



        });




    });