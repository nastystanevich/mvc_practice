
/**
 * Controller class. Orchestrates the model and view objects. 
 *
 * @param {View} view view instance.
 * @param {Model} model model instance.
 *
 * @constructor
 */
function Controller(model, view) {
    var that = this;

    /**
     * Initialize controller.
     * Call the model to create objects and then call the view to render the page
     * 
     * @public
     */
    this.init = function() {
        
        var allTabs           = view.getAllTabs();
        var searchOrderBtn    = view.getSearchOrderBtn();
        var inputOrderField   = view.getInputOrderField();
        var updateOrderBtn    = view.getUpdateOrderBtn();
        var searchProductBtn  = view.getSearchProductBtn();
        var inputItemField    = view.getInputItemField();
        var updateItemBtn     = view.getUpdateItemBtn();
        var productsTable     = view.getProductsTable();
        var productsTableHead = view.getProductsTableHead();
        var deleteOrderBtn    = view.getDeleteOrderBtn();
        var blockForOrders    = view.getBlockForOrders();
        var editBtns          = view.getEditBtns();
        var saveBtns          = view.getSaveBtns();
        var cancelBtns        = view.getCancelBtns();

        allTabs.forEach(function(tab) {
            tab.addEventListener("click", that._openInfo);
        });
        inputOrderField  .addEventListener("change", that._searchOrder)
        searchOrderBtn   .addEventListener("click",  that._searchOrder);
        updateOrderBtn   .addEventListener("click",  that._doRenderingOrders);
        searchProductBtn .addEventListener("click",  that._searchProduct);
        inputItemField   .addEventListener("change", that._searchProduct)
        updateItemBtn    .addEventListener("click",  that._searchProduct);
        productsTableHead.addEventListener("click",  that._doSortingTable);
        deleteOrderBtn   .addEventListener("click",  that._doDeletingOrder);
        productsTable    .addEventListener("click",  that._doDeletingProduct);
        blockForOrders   .addEventListener("click",  that._doSelectOrder);

        editBtns.forEach(function(editBtn) {
            editBtn.addEventListener("click", that._onEditButtonClick);
        });
        saveBtns.forEach(function(saveBtn) {
            saveBtn.addEventListener("click", that._onSaveEditingButtonClick);
        });
        cancelBtns.forEach(function(cancelBtn) {
            cancelBtn.addEventListener("click", that._onCancelEditingButtonClick);
        });

        //MODALS WINDOWS
        var itemModal          = view.getItemModal();
        var orderModalSummary  = view.getOrderModalSummary();
        var orderModalShipTo   = view.getOrderModalShipTo();
        var orderModalCustomer = view.getOrderModalCustomer();
        var addOrderBtn        = view.getAddOrderBtn();
        var addItemBtn         = view.getAddItemBtn();
        var saveOrderBtn       = view.getSaveOrderBtn();
        var saveItemBtn        = view.getSaveItemBtn();
        var modalsCloseButtons = view.getModalsCloseButtons();
        
        //Buttons to open next form
        var summaryNextStepBtn = view.getSummaryNextStepBtn();
        var shipNextStepBtn    = view.getShipNextStepBtn();

        addOrderBtn       .addEventListener("click",  that._onOpenModalButton);
        saveOrderBtn      .addEventListener("click",  that._onSaveOrderButton);
        summaryNextStepBtn.addEventListener("click",  that._doOpeningNextModal);
        shipNextStepBtn   .addEventListener("click",  that._doOpeningNextModal);

        addItemBtn        .addEventListener("click",  that._onOpenModalButton);
        saveItemBtn       .addEventListener("click",  that._onSaveProductButton);
        
        itemModal         .addEventListener("keyup",  that._doValidation);
        orderModalSummary .addEventListener("change", that._doValidation);
        orderModalShipTo  .addEventListener("keyup",  that._doValidation);
        orderModalCustomer.addEventListener("keyup",  that._doValidation);

        modalsCloseButtons.forEach(function(button) {
            button.addEventListener("click", view.closeModal);
        });
             
        model
            .createOrdersObject()
            .then(function(){
                 that._doRenderingOrders();   
            });
    };

    /**
	 * Start rendering the page.
	 *
	 * @private
	 */
    this._doRenderingOrders = function() {
        var orders = model.getOrders(); 
        view.renderOrdersList(orders);
    };
    /**
     * Block of orders click event handler.
     * 
     * @listens click
     * 
     * @param {Event} e the DOM event object.
     * 
     * @private
     */
    this._doSelectOrder = function (e) {
        var orderId = view.selectOrder(e);
        var selectedOrder = model.findSelectedOrderById(orderId);
        var totalPrice = model.getTotalPrice(orderId);

        if (view.inEditing()) {
            view.cancelEditing();
        };
        view.renderMainPart(selectedOrder, totalPrice);
    };
    /**
     * Information tabs click event handler.
     * 
     * @listens click
     * 
     * @param {Event} e the DOM event object.
     * 
     * @private
     */
    this._openInfo = function (e) {
        var activeTab = this;
        var allTabs = view.getAllTabs();
        if (view.inEditing()) {
            view.cancelEditing();
        };
        view.createActive(allTabs, activeTab);
        view.displayInfo(activeTab);
    };
    /**
     * Search orders button click event handler.
     * Order input field change event handler.
     * 
     * @listens click
     * @listens change
     * 
     * @private
     */
    this._searchOrder = function () {
        var inputValue = view.getOrdersInputValue();
        var filteredOrders = model.getFilteredOrders(inputValue);
        view.renderOrdersList(filteredOrders);
    };
    /**
     * Search products button click event handler.
     * Product input field change event handler.
     * Update products button click event handler.
     * 
     * @listens click
     * @listens change
     * 
     * @private
     */
    this._searchProduct = function () {
        var inputValue = view.getProductsInputValue();
        var filteredProducts = model.getFilteredProducts(inputValue);
        view.renderProductsTable(filteredProducts);
    };
    /**
     * Header of the product table click event handler.
     * 
     * @listens click
     * 
     * @param {Event} e the DOM event object.
     * 
     * @private
     */
    this._doSortingTable = function (e) {
        var columnNumber = e.target.dataset.id;
        view.sortTable(columnNumber);
    };
    /**
     * Delete order button event handler.
     * 
     * @listens click
     * 
     * @private
     */
    this._doDeletingOrder = function () {
        var activeOrderId = model.getActiveOrder().id;
        var endOfUrl = "/" + activeOrderId;

        model
            .deleteData(endOfUrl)
            .then(function () {
                return model.createOrdersObject()
            })
            .then(that._doRenderingOrders);
    };
    /**
     * Delete product button event handler.
     * 
     * @listens click
     * 
     * @private
     */
    this._doDeletingProduct = function (e) {
        if (view.isDeleteButton(e)) {
            var product = event.path[2];
            var productId = product.dataset.id;
            var activeOrderId = model.getActiveOrder().id;
            var endOfUrl = "/" + activeOrderId + "/products/" + productId;

            model
                .deleteData(endOfUrl)
                .then(function () {
                    return model.createOrdersObject();
                })
                .then(function () {
                    view.hideDeletedProduct(product);
                });

        }
    };
    /**
     * Edit buttons event handler.
     * 
     * @listens click
     * 
     * @param {Event} e the DOM event object.
     * 
     * @private
     */
    this._onEditButtonClick = function (e) {
        view.makeEditable(e);
    };
    /**
     * Save editing buttons event handler.
     * 
     * @listens click
     * 
     * @param {Event} e the DOM event object.
     * 
     * @private
     */
    this._onSaveEditingButtonClick = function (e) {
        view.getEditedValues()
            .then(function (values) {
                model.saveEditing(values);

                var data = model.getActiveOrder();
                var endOfUrl = "/replace";

                return model.postData(data, endOfUrl);
            })
            .then(view.cancelEditing)
            .catch(function(err) {
                console.log(err);
            })
            
    };

    /**
     * Cancel editing buttons event handler.
     * 
     * @listens click
     * 
     * @param {Event} e the DOM event object.
     * 
     * @private
     */
    this._onCancelEditingButtonClick = function () {
        view.cancelEditing();
    };

//---------------------------------------------------
//MODALS
    /**
     * Add new order button event handler.
     * Add new product button event handler.
     * 
     * @listens click
     * 
     * @param {Event} e the DOM event object.
     * 
     * @private
     */
    this._onOpenModalButton = function(e) {
        var activeButton = this;
        view.openModal(activeButton);
    };
    /**
     * Open next modal buttons event handler.
     * 
     * @listens click
     * 
     * @private
     */
    this._doOpeningNextModal = function() {
        var activeButton = this;
        view.closeModal();
        view.openModal(activeButton);
    };
    /**
     * New order modal forms event handler.
     * New product modal form event handler.
     * 
     * @listens change
     * @listens keyup
     * 
     * @param {Event} e the DOM event object.
     * 
     * @private
     */
    this._doValidation = function(e) {
        view.validate(e);
    };

    /**
     * Save new product button event handler.
     * 
     * @listens click
     * 
     * @private
     */
    this._onSaveProductButton = function () {
        view.getInputValues()
            .then(function (inputValues) {
                var data = model.attachOrderToNewProduct(inputValues);
                var endOfUrl = "/products";

                return model.postData(data, endOfUrl); 
            })
            .then(function (product) {
                view.addTableRow(product);
                return model.createOrdersObject();
            })
            .then(function(){
                view.closeModal();
                view.cleanModalInputs();
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    /**
     * Save new order button event handler.
     * 
     * @listens click
     * 
     * @private
     */
    this._onSaveOrderButton = function() {
        var inputOrder = view.getInputOrderValues();
        model
            .putNewOrder(inputOrder)
            .then(function(){
                return model.createOrdersObject()
            })
            .then(that._doRenderingOrders)
            .then(view.closeModal);
    };
};

(new Controller(new Model, new View)).init();