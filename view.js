/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
function View(){
    var that = this;
    /**
     * Empty product raw element in the products table
     * @type {HTMLTableRowElement}
     * 
     * @private
     */
    var _emptyItemContainer  = document.querySelector(".item");
    /**
     * Empty order element in the orders list
     * @type {HTMLLIElement}
     * 
     * @private
     */
    var _emptyOrderContainer = document.querySelector(".order");
    
    /**
     * Order accepted status.
     * @constant
	 * @type {string}
     */
    var ACCEPTED_STATUS = "accepted";
    /**
     * Order pending status.
     * @constant
	 * @type {string}
     */
    var PENDING_STATUS  = "pending";

    /**
     * Icon "sort up" DOM element.
     * @constant
	 * @type {string}
     */
    var ICON_UP = "<i class='fas fa-sort-up'></i>";

    /**
     * Icon "sort down" DOM element.
     * @constant
	 * @type {string}
     */
    var ICON_DOWN = "<i class='fas fa-sort-down'></i>";

    /**
     * Icon "no sort" DOM element.
     * @constant
	 * @type {string}
     */
    var ICON_NO_SORT = "<i class='fas fa-sort'></i>";

    /**
     * ID of the "delete product" button DOM element.
     * @constant
	 * @type {string}
     */
    var DELETE_BTN_ID = "js-delete-product";
    
    /**
     * Contain the currently selected order HTML block.
     * @type {HTMLElement}
     * 
     * @private
     */
    var _activeOrderBlock = null;
    /**
     * Contain the currently selected order HTML block ID.
     * @type {number}
     */
    var activeOrderId = null;
    
    
    /**
     * Main content block HTML element.
     * @type {HTMLElement}
     * 
     * @private
     */
    var _mainContent = document.querySelector(".main-content");
    /**
     * Blank content block HTML element.
     * @type {HTMLElement}
     * 
     * @private
     */
    var _blankContent = document.querySelector(".blank-content.main");
    
    /**
     * HTML element block with orders list.
     * @type {HTMLOListElement}
     */
    var blockForOrders = document.querySelector("ol");
    /**
     * Products table.
     * @type {HTMLTableElement}
     */
    var productsTable = document.querySelector("#products-list");
    /**
     * All HTML TH elements.
     * @type {HTMLTableHeaderCellElement}
     * 
     * @private
     */
    var _productsTableThs = document.getElementsByTagName("th");


    /**
    * All HTML TH elements.
     * @type {HTMLTableHeaderCellElement}
     * 
     * @private
     */
    var _deleteOrderButton = document.querySelector("#js-delete-order");

    /**
     * Returns tab collection.
     * 
     * @returns {NodeList} div collection.
     * 
     * @public
     */
    this.getAllTabs = function() {
        return document.querySelectorAll(".tab");
    };

    /**
     * Returns search order button.
     * 
     * @returns {HTMLElement}
     * 
     * @public
     */
    this.getSearchOrderBtn = function() {
        return document.querySelector("#js-search-order");
    };

    /**
     * Returns order input field.
     * 
     * @returns {HTMLInputElement} the input element.
     * 
     * @public
     */
    this.getInputOrderField = function() {
        return document.querySelector("#js-order-input");
    };

    /**
     * Returns update order button.
     * 
     * @returns {HTMLElement}
     * 
     * @public
     */
    this.getUpdateOrderBtn = function() {
        return document.querySelector("#js-update-orders");
    };

    /**
     * Returns search product button.
     * 
     * @returns {HTMLElement}
     * 
     * @public
     */
    this.getSearchProductBtn = function() {
        return document.querySelector("#js-search-item");
    };

    /**
     * Returns product input field.
     * 
     * @returns {HTMLInputElement} the input element.
     * 
     * @public
     */
    this.getInputItemField = function() {
        return document.querySelector("#js-item-input");
    };

    /**
     * Returns update products button.
     * 
     * @returns {HTMLElement}
     * 
     * @public
     */
    this.getUpdateItemBtn = function() {
        return document.querySelector("#js-update-items");
    };

    /**
     * Returns products table.
     * 
     * @returns {HTMLTableElement} the table element.
     * 
     * @public
     */
    this.getProductsTable = function() { 
        return productsTable;
    };

    /**
     * Returns products table header.
     * 
     * @returns {HTMLTableRowElement} the table row element.
     * 
     * @public
     */
    this.getProductsTableHead = function() {
        return document.querySelector("#thead");
    };

    /**
     * Returns delete order button.
     * 
     * @returns {HTMLElement}
     * 
     * @public
     */
    this.getDeleteOrderBtn = function() {
        return _deleteOrderButton;
    };

    /**
     * Returns block of orders.
     * 
     * @returns {HTMLOListElement} the ol list element.
     * 
     * @public
     */
    this.getBlockForOrders = function() {
        return blockForOrders;
    };
    
    /**
     * Returns edit button.
     * 
     * @returns {HTMLElement}
     * 
     * @public
     */
    this.getEditBtns = function() {
        return document.querySelectorAll(".edit");
    };

    /**
     * Returns save editing button.
     * 
     * @returns {HTMLElement}
     * 
     * @public
     */
    this.getSaveBtns = function() {
        return document.querySelectorAll(".save");
    };

    /**
     * Returns cancel editing button.
     * 
     * @returns {HTMLElement}
     * 
     * @public
     */
    this.getCancelBtns = function() {
        return document.querySelectorAll(".cancel");
    };
    

    //Rendering

    /**
     * Render order list and select main block for rendering.
     * 
     * @param {Object[]} orders the array of orders.
     * 
     *  @public
     */
    this.renderOrdersList = function(orders) {

        var ordersList = orders;

        //during filtering remove unsuitable orders
        this._removeOrders();
    
        var ordersAmount = document.querySelector(".amount");
        ordersAmount.textContent = ordersList.length;
        
        this._checkEmptyList(ordersAmount.textContent);
        
        
        //render an order block
        ordersList.forEach(function(order) {
            var info = order.summary;
            var newOrder = _emptyOrderContainer.cloneNode(true);
    
            newOrder.classList.remove("hidden");
            newOrder.dataset.id = order.id;
            newOrder.querySelector(".title").textContent = "Order " + order.id;
            newOrder.querySelector(".date").textContent = info.createdAt;
            newOrder.querySelector(".customer").textContent = info.customer;
            newOrder.querySelector(".shipped").textContent = "Shipped: " + info.shippedAt;
    
            that._addOrderStatus(newOrder, info);
            
            blockForOrders.appendChild(newOrder);
        });
        
        var aciveOrderBlock = blockForOrders.querySelector(".active");
    
        //Check whether there is a selected order.
        if (aciveOrderBlock) {
            this.renderMainPart(aciveOrderBlock.dataset.id);
        } else {
            this._renderMainBlank();
        };
    };

    /**
     * Remove orders in oreders list.
     * 
     * @private
     */
    this._removeOrders = function() {
        var orders = document.querySelectorAll(".order");
        for (var i = 0; i < orders.length; i++){
            orders[i].remove();
        };
    };

    /**
     * Check if orders are in the list, if no ordrers display the message.
     * 
     * @param {number} ordersAmount
     * 
     * @private
     */
    this._checkEmptyList = function(ordersAmount) {
        var _blankContent = document.querySelector(".blank-content.aside");
        if (ordersAmount == 0){
            _blankContent.classList.remove("hidden");
        } else{
            _blankContent.classList.add("hidden");
        };
    };
    
    /**
     * Add status classes to order.
     * 
     * @param {HTMLLiElement} newOrder HTML LI element for order list item.
     * @param {Object} info order summary.
     * 
     * @private
     */
    this._addOrderStatus = function(newOrder, info) {
        var newOrderStatus = newOrder.querySelector(".status");
        newOrder.querySelector(".status").textContent = info.status;

        if (info.status.toLowerCase() == ACCEPTED_STATUS){
            newOrderStatus.classList.add("accepted");
        }else if (info.status.toLowerCase() == PENDING_STATUS){
            newOrderStatus.classList.add("pending");
        } else{
            newOrderStatus.classList.add("late");
        }
    };

    /**
     * Render blank main part if no orders are selected.
     * 
     * @private
     */
    this._renderMainBlank = function() {
        _mainContent.classList.add("hidden");
        _blankContent.classList.remove("hidden");
        _deleteOrderButton.classList.add("hidden");
    };

    /**
     * Render "summary" part of the order. Call rendering other parts.
     * 
     * @param {Object} activeOrder selected order object.
     * @param {number} totalPrice selected order total price of products.
     * 
     * @public
     */
    this.renderMainPart = function(activeOrder, totalPrice) {

        _mainContent.classList.remove("hidden");
        _blankContent.classList.add("hidden");
        _deleteOrderButton.classList.remove("hidden");

        //rendering Info Part of main block
        var orderInfo = document.querySelector(".order-information");
        orderInfo.querySelector(".number").textContent   = activeOrder.id;
        orderInfo.querySelector(".price").textContent    = totalPrice;
        orderInfo.querySelector(".currency").textContent = activeOrder.summary.currency;

        var info = activeOrder.summary;
        orderInfo.querySelector(".customer").textContent     = info.customer;
        orderInfo.querySelector(".date").textContent         = info.createdAt;
        orderInfo.querySelector(".shipped-date").textContent = info.shippedAt;
        
        that._renderShippingInfo(activeOrder);
        that._renderCustomerInfo(activeOrder);
        that._renderMap(activeOrder.shipTo);
        that.renderProductsTable(activeOrder.products);
    };

    /**
     * Render "ship to" part of the order.
     * 
     * @param {Object} order selected order object.
     * 
     * @private
     */
    this._renderShippingInfo = function(order) {
        var ShipTo = order.shipTo;
        var shipTable = document.querySelector("#shipping-table");
    
        shipTable.querySelector(".name").textContent = ShipTo.name;
        shipTable.querySelector(".street").textContent = ShipTo.address;
        shipTable.querySelector(".zip").textContent = ShipTo.ZIP;
        shipTable.querySelector(".region").textContent = ShipTo.region;
        shipTable.querySelector(".country").textContent = ShipTo.country;
    };

    /**
     * Render "customer" part of the order.
     * 
     * @param {Object} order selected order object.
     * 
     * @private
     */
    this._renderCustomerInfo = function(order) {
        var CustomerInfo  = order.customerInfo;
        var customerTable = document.querySelector("#customer-table");
    
        customerTable.querySelector(".firstName").textContent = CustomerInfo.firstName;
        customerTable.querySelector(".lastName").textContent  = CustomerInfo.lastName;
        customerTable.querySelector(".address").textContent   = CustomerInfo.address;
        customerTable.querySelector(".phone").textContent     = CustomerInfo.phone;
        customerTable.querySelector(".email").textContent     = CustomerInfo.email;
    };

    /**
     * Render map picture of "ship to" address.
     * 
     * @param {Object} address selected order "ship to" address.
     * 
     * @private
     */
    this._renderMap = function(address) {
        var street = address.address.replace(" ", "+");
        var addressString = address.country + "+" + 
                            street;
        that._getMapPicture(addressString).then(function(url){
            var img = document.querySelector("#map");
            img.src = url;
        });
    };

    /**
     * Resolve function takes a map picture URL.
     * 
     * @param {string} addressString selected order "ship to" address.
     * 
     * @returns {Promise} the promise object will be resolved once XHR gets loaded.
     * 
     * @private
     */
    this._getMapPicture = function(addressString) {
        return new Promise(function(resolve, reject) {
            var url = "https://geocode-maps.yandex.ru/1.x/?apikey=2c427e85-ce07-46c4-8c46-659c33d60074&format=json&geocode=" + addressString;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);

            xhr.addEventListener("load", function () {
                if (xhr.status < 400) {
                    var data = JSON.parse(xhr.responseText);
                    var point = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.replace(" ", ",");
                    
                    var imgUrl = "https://static-maps.yandex.ru/1.x/?l=map&size=650,200&z=13&l=map&pt=" + point + ",pm2bll";
                    resolve(imgUrl);
                } else {
                    reject (new Error("Didn't find the map picture"));
                };
            });
            xhr.send();
        });
    };

    /** 
     * Render products table.
     * 
     * @param {Object[]} products the array of products.
     * 
     * @public
     */
    this.renderProductsTable = function(products) {

        that._renderDefaultSortIcons();

        var productsAmount = products.length;
        document.querySelector(".items-amount").textContent = productsAmount;

        var rows = document.querySelectorAll(".item");

        //deleting old rows
        for (var i = 0; i < rows.length; i++) {
            rows[i].remove();
        }

        //creating new rows
        products.forEach(function(product) {
            that.addTableRow(product);
        });
    };

    /**
     * Add product in the products table. 
     * 
     * @param {Object} product
     * 
     * @public
     */
    this.addTableRow = function(product) {
            var newItem = _emptyItemContainer.cloneNode(true); 

            newItem.dataset.id = product.id || "";
            newItem.querySelector(".product-name").textContent = product.name;
            newItem.querySelector(".index").textContent = product.id;
            newItem.querySelector(".u-price").textContent = product.price;
            newItem.querySelector(".currency").textContent = product.currency;
            newItem.querySelector(".quantity").textContent = product.quantity;
            newItem.querySelector(".total-price").textContent = product.totalPrice;
		
            productsTable.appendChild(newItem);
    };
    

    /**
     * Render "no sort" icons in the products table.
     * 
     * @private
     */
    this._renderDefaultSortIcons = function() {
        for (var i = 0; i < _productsTableThs.length - 1; i++) {
            var defaultIcon = _productsTableThs[i].querySelector(".icon");
            defaultIcon.innerHTML = ICON_NO_SORT;
        };
    };
    
    /**
     * Find selected order in OL list of orders.
     * 
     * @param {Event} e the DOM event object.
     * 
     * @returns {number} selected order ID.
     * 
     * @public
     */
    this.selectOrder = function(e) {
        var target = e.target;
        while (target.tagName != "OL") {
            if (target.tagName == "LI"){
                var orders = document.querySelectorAll(".order");
                _activeOrderBlock = target;
    
                activeOrderId = _activeOrderBlock.dataset.id;
        
                that.createActive(orders, _activeOrderBlock);

                return activeOrderId;
            } else {
                target = target.parentNode;
            };
        }; 
    };
    
    /**
     * Add or remove class "active". Use for orders and tabs.
     * 
     * @param {NodeList} elements 
     * @param {HTMLElement} active 
     * 
     * @public
     */
    this.createActive = function(elements, active){
        elements.forEach(function(element) {
            if (element == active){
                element.classList.add("active");
            } else{
                element.classList.remove("active");
            };
        });
    };

    /**
     * Display information section in dependence on active tab.
     * 
     * @param {HTMLElement} activeTab
     * 
     * @public
     */
    this.displayInfo = function(activeTab) {
        var shipInfo     = document.querySelector("#ship-info");
        var customerInfo = document.querySelector("#customer-info");
        var mapInfo      = document.querySelector("#map-info");
    
        if(activeTab.dataset.id == "ship-tab") {
            shipInfo    .classList.remove("hidden");
            customerInfo.classList.add("hidden");
            mapInfo     .classList.add("hidden");
        } else if (activeTab.dataset.id == "customer-tab") {
            shipInfo    .classList.add("hidden");
            customerInfo.classList.remove("hidden");
            mapInfo     .classList.add("hidden");
        } else{
            mapInfo     .classList.remove("hidden");
            shipInfo    .classList.add("hidden");
            customerInfo.classList.add("hidden");
        };
    };

    /**
     * Returns order input field value in low case.
     * @returns {string} order input field value.
     * 
     * @public
     */
    this.getOrdersInputValue = function() {
        return document.querySelector("#js-order-input")
               .value.toLowerCase();
    };

    /**
     * Returns product input field value in low case.
     * @returns {string} order input field value.
     * 
     * @public
     */
    this.getProductsInputValue = function() {
        return document.querySelector("#js-item-input")
               .value.toLowerCase();
    };

    /**
     * Sort the products table in dependence on selected column.
     * 
     * @param {number} n a column number.
     * 
     * @public
     */
    this.sortTable = function(n) {
       
        var sortIcon =  _productsTableThs[n].querySelector(".icon");

        that._renderDefaultSortIcons();

        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("products-list");
        switching = true;

        dir = "asc"; 

        while (switching) {

            switching = false;
            rows = table.rows;

            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;

                x = rows[i].getElementsByTagName("TD")[n].getElementsByTagName("SPAN")[0].innerHTML.toLowerCase();
                y = rows[i + 1].getElementsByTagName("TD")[n].getElementsByTagName("SPAN")[0].innerHTML.toLowerCase();
                if(n !=  0){
                    x = parseFloat(x);
                    y = parseFloat(y);
                };

                if (dir == "asc") {
                    if (x > y) {
                        shouldSwitch= true;
                        break;
                    };
                } else if (dir == "desc") {
                    if (x < y) {
                        shouldSwitch = true;
                        break;
                    };
                };
            };
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
		
                switchcount ++;      
            } else {
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                };
            };
        };

        //changing icons
        if (dir == "asc"){
            sortIcon.innerHTML = ICON_UP;
        } else {
            sortIcon.innerHTML = ICON_DOWN;
        }
    };

    /**
     * Check whether the clicked element is the delete button.
     * 
     * @param {Event} e the DOM event object.
     * 
     * @returns {boolean} true if element is the delete button.
     * 
     * @public
     */
    this.isDeleteButton = function(e) {
        return e.target.id == DELETE_BTN_ID;
    };

    /**
     * Hide product if it was deleted. 
     * 
     * @param {HTMLTableRowElement} product the product table row.
     * 
     * @public
     */
    this.hideDeletedProduct = function(product) {
        product.classList.add("hidden");
    };

    //EDIT

    /**
     * the section of the selected order information to edit (ship to / customer).
     * @type {HTMLElement}
     * 
     * @public
     */
    var editableSection = null;

    /**
     * The table in section of editing information.
     * @type {HTMLTableElement}
     * 
     * @private
     */
    var _editablePart = null;

    /**
     * Static element with order information.
     * @type {HTMLElement}
     * 
     * @private
     */
    var _spans = null;

    /**
     * Input element to change order information.
     * @type {HTMLInputElement}
     * 
     * @private
     */
    var _inputs = null;

    /**
     * Edit information button.
     * @type {HTMLElement}
     * 
     * @private
     */
    var _editBtn = null;

    /**
     * Save editing information button.
     * @type {HTMLElement}
     * 
     * @private
     */
    var _saveBtn = null;

    /**
     * Cancel editing information button.
     * @type {HTMLElement}
     * 
     * @private
     */
    var _cancelBtn = null;

    /**
     * Make static information fields editable.
     * 
     * @param {Event} e the DOM event object. 
     * 
     * @public
     */
    this.makeEditable = function(e) {
        editableSection = event.path[3];
        _editablePart    = editableSection.querySelector("table");

        //tds    = _editablePart.querySelectorAll(".editable");
        _spans  = _editablePart.querySelectorAll("span");
        _inputs = _editablePart.querySelectorAll("input");

        for (var i = 0; i < _spans.length; i++) {
            _inputs[i].value = _spans[i].innerText;;
            _inputs[i].classList.remove("hidden");
            _spans[i].classList.add("hidden");
        };

        _editBtn   = editableSection.querySelector(".edit");
        _saveBtn   = editableSection.querySelector(".save");
        _cancelBtn = editableSection.querySelector(".cancel");

        _editBtn.classList.add("hidden");
        _saveBtn.classList.remove("hidden");
        _cancelBtn.classList.remove("hidden");
    };

    /**
     * Check whether editable fields.
     * 
     * @returns {boolean} true if there're editable fields.
     * 
     * @public
     */
    this.inEditing = function() {
        if (editableSection) {
            return true;
        }; 
    };

    /**
     * Returns promise. Resolve function takes an editing values object.
     * 
     * @returns {Promise} the promise object will be resoloved if user agree to save editing.
     * 
     * @public
     */
    this.getEditedValues = function() {
        return new Promise(function(resolve, reject){
            var userResponse = confirm("Are you sure?");
                if (userResponse){

                    for (var i = 0; i < _spans.length; i++){
                        _spans[i].innerText = _inputs[i].value;
                        _inputs[i].classList.add("hidden");
                        _spans[i].classList.remove("hidden");
                    };

                    var inputValues = {
                        editableSection: editableSection.id,
                        valuesArray: [
                            _spans[0].innerText,
                            _spans[1].innerText,
                            _spans[2].innerText,
                            _spans[3].innerText,
                            _spans[4].innerText
                        ]
                    };
                    resolve(inputValues);
                } else {
                    reject();
                }
        });
    };

 

    /**
     * Make all fields uneditable.
     * 
     * @public
     */
    this.cancelEditing = function() {
        for (var i = 0; i < _spans.length; i++){
            _inputs[i].classList.add("hidden");
            _spans[i].classList.remove("hidden");
        };
        _editBtn.classList.remove("hidden");
        _saveBtn.classList.add("hidden");
        _cancelBtn.classList.add("hidden");
    };

    //----------------------------------------------------------------------------
    //Modals

    /**
     * New product modal form.
     * @type {HTMLElement}
     */
    var itemModal = document.querySelector("#item-modal");

    /**
     * New order summary modal form.
     * @type {HTMLElement}
     */
    var orderModalSummary = document.querySelector("#order-modal-summary");

    /**
     * New order ship to modal form.
     * @type {HTMLElement}
     */
    var orderModalShipTo = document.querySelector("#order-modal-ship-to");

    /**
     * New order customer modal form.
     * @type {HTMLElement}
     */
    var orderModalCustomer = document.querySelector("#order-modal-customer");

    /**
     * Active modal form.
     * @type {HTMLElement}
     */
    var activeModal = null;

    /**
     * Add order button.
     * @type {HTMLElement}
     */
    var addOrderBtn = document.querySelector("#js-add-order");

    /**
     * Add product button.
     * @type {HTMLElement}
     */
    var addItemBtn = document.querySelector("#js-add-item");

    /**
     * Save new order button.
     * @type {HTMLElement}
     */
    var saveOrderBtn = document.querySelector("#js-save-order");

    /**
     * Save new product button.
     * @type {HTMLElement}
     */
    var saveItemBtn = document.querySelector("#js-save-item");

    /**
     * Open next modal form button.
     * @type {HTMLElement}
     */
    var summaryNextStepBtn = document.querySelector("#summary-next-step");

    /**
     * Open next modal form button.
     * @type {HTMLElement}
     */
    var shipNextStepBtn = document.querySelector("#ship-next-step");


    /**
     * Returns new product modal form.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getItemModal = function () {
        return itemModal;
    };

    /**
     * Returns new order summary modal form.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getOrderModalSummary = function () {
        return orderModalSummary;
    };

    /**
     * Returns new order ship to modal form.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getOrderModalShipTo = function () {
        return orderModalShipTo;
    };

    /**
     * Returns new order customer modal form.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getOrderModalCustomer = function () {
        return orderModalCustomer;
    };

    /**
     * Returns add new order button.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getAddOrderBtn = function () {
        return addOrderBtn;
    };

    /**
     * Returns add new product button.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getAddItemBtn = function () {
        return addItemBtn;
    };

    /**
     * Returns save new order button.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getSaveOrderBtn = function () {
        return saveOrderBtn;
    };

    /**
     * Returns save new product button.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getSaveItemBtn = function () {
        return saveItemBtn;
    };

    /**
     * Returns "summary" next modal button.
     * 
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getSummaryNextStepBtn = function () {
        return summaryNextStepBtn;
    };

    /**
     * Returns "ship to" next modal button.
     *  
     * @returns {HTMLElement} 
     * 
     * @public
     */
    this.getShipNextStepBtn = function () {
        return shipNextStepBtn;
    };

    //var modalsCloseButtons = document.querySelectorAll(".close");
    this.getModalsCloseButtons = function () {
        return document.querySelectorAll(".close");
    }

    /**
     * Open modal form.
     * 
     * @param {HTMLElement} activeButton button which open modal form.
     * 
     * @public
     */
    this.openModal = function (activeButton) {

        if (activeButton == summaryNextStepBtn) {
            var modal = orderModalShipTo;
        } else if (activeButton == shipNextStepBtn) {
            var modal = orderModalCustomer;
        } else if (activeButton == addOrderBtn) {
            var modal = orderModalSummary;
        } else {
            var modal = itemModal;
        }

        modal.classList.remove("closed");
        modal.classList.add("opened");

        activeModal = modal;

        var overflow = document.createElement("div");
        overflow.className = "overflow";
        document.body.appendChild(overflow);

        overflow.addEventListener("click", that.closeModal);
    };

    /**
     * Clean all input fields in modal forms.
     * 
     * @public
     */
    this.cleanModalInputs = function () {
        var modals = document.querySelectorAll(".modal");
        modals.forEach(function(modal) {
            var inputs = modal.querySelectorAll("input");
            var message = modal.querySelectorAll(".invalid-message");
            inputs.forEach(function(input) {
                input.value = "";
                input.classList.remove("is-valid");
                input.classList.add("is-invalid");
                message.classList.remove("hidden");
            });
        });
    };
    
    /**
     * Close active modal form.
     * 
     * @public
     */
    this.closeModal = function () {
        var overflow = document.querySelector(".overflow");
        activeModal.classList.remove("opened");
        activeModal.classList.add("closed");
        overflow.remove();
    };

    /**
     * Check for a non-empty string
     * 
     * @param {Event} e the DOM event object.
     * 
     * @public
     */
    this.validate = function (e) {
        if (e.target.tagName == "INPUT") {
            var inputField = event.target;

            if (inputField.value.length == "") {
                inputField.classList.add("is-invalid");
                inputField.classList.remove("is-valid");
            } else {
                inputField.classList.remove("is-invalid");
                inputField.classList.add("is-valid");
            }
            if (activeModal.querySelectorAll(".is-invalid").length == 0) {
                activeModal.querySelector(".invalid-message").classList.add("hidden");
                activeModal.querySelector(".formBtn").removeAttribute("disabled");
            } else {
                activeModal.querySelector(".invalid-message").classList.remove("hidden");
                activeModal.querySelector(".formBtn").setAttribute("disabled", "");
            }
        }
    };

    /**
     * Returns Promise. Resolve function takes an input values of new product modal form.
     * 
     * @returns {Promise} the promise object will be resolved once user wants to save new product. 
     * 
     * @public 
     */
    this.getInputValues = function () {
        return new Promise(function (resolve, reject) {
            var userResponse = confirm("Are you sure?");

            if (userResponse) {
                var inputValues = {};
                var inputName = itemModal.querySelector(".name").value;
                var inputPrice = itemModal.querySelector(".price").value;
                var inputQuantity = itemModal.querySelector(".quantity").value;
                var inputValues = {};

                inputValues.name = inputName;
                inputValues.price = inputPrice;
                inputValues.quantity = inputQuantity;
                inputValues.totalPrice = Number.parseFloat(inputPrice) * Number.parseInt(inputQuantity);
                resolve(inputValues);
            } else {
                reject(new Error("User's refuse"));
            }
        })
    };

    /**
     * Returns input values of new order modal form.
     * 
     * @returns {Object} order.
     * 
     * @public 
     */
    this.getInputOrderValues = function () {
        //Summary
        var newOrder = {};
        newOrder.summary = {};
        newOrder.shipTo = {};
        newOrder.customerInfo = {};

        var createdInput = orderModalSummary.querySelector("#created").value;
        var customerInput = orderModalSummary.querySelector("#customer").value;
        var statusInput = orderModalSummary.querySelector("#status").value;
        var shipedInput = orderModalSummary.querySelector("#shiped").value;
        var currencyInput = orderModalSummary.querySelector("#currency").value;

        newOrder.summary.createdAt = createdInput;
        newOrder.summary.customer = customerInput;
        newOrder.summary.status = statusInput;
        newOrder.summary.shippedAt = shipedInput;
        newOrder.summary.currency = currencyInput;

        //ShipTo
        var nameInput = orderModalShipTo.querySelector("#name").value;
        var addressInput = orderModalShipTo.querySelector("#address").value;
        var zipInput = orderModalShipTo.querySelector("#zip").value;
        var regionInput = orderModalShipTo.querySelector("#region").value;
        var countryInput = orderModalShipTo.querySelector("#country").value;

        newOrder.shipTo.name = nameInput;
        newOrder.shipTo.address = addressInput;
        newOrder.shipTo.ZIP = zipInput;
        newOrder.shipTo.region = regionInput;
        newOrder.shipTo.country = countryInput;

        //Customer
        var fNameInput = orderModalCustomer.querySelector("#first-name").value;
        var lNameInput = orderModalCustomer.querySelector("#last-name").value;
        var addressInput = orderModalCustomer.querySelector("#address").value;
        var phoneInput = orderModalCustomer.querySelector("#phone").value;
        var emailInput = orderModalCustomer.querySelector("#email").value;

        newOrder.customerInfo.firstName = fNameInput;
        newOrder.customerInfo.lastName = lNameInput;
        newOrder.customerInfo.address = addressInput;
        newOrder.customerInfo.phone = phoneInput;
        newOrder.customerInfo.email = emailInput;

        return newOrder;
    };
};