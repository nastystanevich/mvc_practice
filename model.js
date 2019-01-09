/**
 * Model class. Knows everything about API endpoint and data structure. Can format/map data to any structure.
 *
 * @constructor
 */
function Model(){
    var that = this;
    /**
     * URL to all orders.
     * @constant
     * @type {string}
     */
    var _ordersUrl   = "http://localhost:3000/api/Orders";

    /**
     * URL's part for requests.
     * @constant
     * @type {string}
     */
    var _beginOfUrl   = "http://localhost:3000/api/Orders/";

    /**
     * URL to all products.
     * @constant
     * @type {string}
     */
    var _productsUrl = "http://localhost:3000/api/OrderProducts";
    
    /**
     * The array of orders.
     * @type {Object[]}
     * 
     */
    var Orders = null;

    /**
     * Selected order.
     * @type {Object}
     */
    var activeOrder = null;

    /**
     * Resolve function takes JSON response.
     * 
     * @param {string} url the URL string.
     * 
     * @returns {Promise} the promise object will be resolved if GET request is loaded.
     * 
     * @private
     */
    this._loadData = function(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);

            xhr.addEventListener("load", function () {
				if (xhr.status < 400) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(new Error("GET reqruest is failed: " + xhr.statusText));
				}
            });

			xhr.addEventListener("error", function () {
				reject(new Error("Network error"));
			});

			xhr.send();
        });
    };

    /**
     * Resolve function takes object Orders.
     * 
     * @returns {Promise} the promise object will be resolved if orders and products are loaded and attached.
     * 
     * @public
     */
        this.createOrdersObject = function () {
        return new Promise(function (resolve, reject) {
            var orders, products;

            that
                ._loadData(_ordersUrl)
                .then(function (ordersList) {
                    a = ordersList;
                    return that._loadData(_productsUrl);
                })
                .then(function (productsList){
                    b = productsList
                    Orders = that._attachProductsToOrders(a, b);
                    resolve(Orders);
                })
                .catch(function(err) {
                    console.log(err);
                    reject();
                })
        });
    };

    /**
     * Attach products to orders.
     * 
     * @param {Object[]} orders the array of orders.
     * @param {Object[]} products the array of products.
     * 
     * @returns {Object[]} the array of orders.
     * 
     * @private
     */
    this._attachProductsToOrders = function(orders, products) {
        orders.forEach(function(order) {
            var orderProducts = products.filter(function(product) {
                return order.id === product.orderId;
            });
            order.products = orderProducts;
        });
        return orders;
    };

    /**
     * Returns orders array.
     * 
     * @returns {Object[]} the array of orders.
     * 
     * @public
     */
    this.getOrders = function() {
        return Orders;
    };

    /**
     * Returns selected order object.
     * 
     * @returns {Object} selected order object.
     * 
     * @public
     */
    this.getActiveOrder = function() {
        return activeOrder;
    }

    /**
     * Returns selected order object by ID.
     * 
     * @param {number} orderId selected order ID.
     * 
     * @returns {Object} selected order object.
     * 
     * @public
     */
    this.findSelectedOrderById = function(orderId) {
        activeOrder = Orders.find(function(order){
            return order.id == orderId;
        });
        return activeOrder;
    };

    /**
     * Returns the total price of order.
     * 
     * @param {number} orderId selected order ID.
     * 
     * @returns {number} total price of the order.
     * 
     * @public
     */
    this.getTotalPrice = function(orderId) {
        var order = Orders.find(function(order){
            return order.id == orderId;
        });

        var totalPrices = order.products.map(function(product){
            return product.totalPrice;
        });

        if(totalPrices.length){
            var totalOrderPrice = totalPrices.reduce(function(a, b) {
                return a + b;
            });
            return totalOrderPrice;
        } else{
            return 0;
        };
    };

    /**
     * Filter the array of orders.
     * 
     * @param {string} value the value of order input field.
     * 
     * @returns {Object[]} the array of filtered orders.
     * 
     * @public
     */
    this.getFilteredOrders = function(value) {
        return Orders.filter(function(order) {
                    var info = order.summary;
                    var title = "order " + order.id;
                    var customer = info.customer.toLowerCase();
                    var createdAt = info.createdAt;
                    var shippedAt = info.shippedAt;
    
                    return  title.includes(value) || 
                            customer.includes(value) ||
                            createdAt.includes(value) ||
                            shippedAt.includes(value);
                });
    };

    /**
     * Filter the array of products.
     * 
     * @param {string} value the value of product input field.
     * 
     * @returns {Object[]} the array of filtered products.
     * 
     * @public
     */
    this.getFilteredProducts = function (value) {
        var products = activeOrder.products;
        return products.filter(function (product) {
            var name = product.name.toLowerCase();
            var price = product.price + " " + product.currency.toLowerCase();
            var totalPrice = product.totalPrice + " " + product.currency.toLowerCase();

            return name.includes(value) ||
                price.includes(value) ||
                totalPrice.includes(value);
        });
    };

    /**
     * 
     * @param {string} endOfUrl the string which specifys end of the URL to delete the order or the product.
     * 
     * @returns {Promise} resolve if DELETE response is loaded
     * 
     * @public
     */
    this.deleteData = function (endOfUrl) {
        return new Promise(function (resolve, reject) {
            if (activeOrder) {
                var userResponse = confirm("Are you sure?");
                if (userResponse) {
                    var xhr = new XMLHttpRequest();

                    xhr.open("DELETE", _ordersUrl + endOfUrl, true);

                    xhr.addEventListener("load", function () {
                        if (xhr.status < 400) {
                            resolve();
                        } else {
                            reject(new Error("Delete request is failed: " + xhr.statusText));
                        }
                    });

                    xhr.addEventListener("error", function () {
                        reject(new Error("Network error"));
                    });

                    xhr.send();
                } else {
                    reject(new Error("User's refuse"));
                }
            } else {
                alert("You should choose the order to delete");
                reject(new Error("No order to delete"));
            };
        });
    };

    /**
     * Save editable input fields in selected order.
     * 
     * @param {Object} values an editing values object.
     * 
     * @public
     */
    this.saveEditing = function(values) {
        var editPart;

        if (values.editableSection == "ship-info") {
            editPart = activeOrder.shipTo;
        } else {
            editPart = activeOrder.customerInfo;
        };

        var keys = Object.keys(editPart);
        for (var i = 0; i < keys.length; i++) {
            editPart[keys[i]] = values.valuesArray[i];
        }
    };



    /**
     * Replace data (order or product)
     * 
     * @returns {Promise} the promise object will be resolved when post request is loaded.
     * 
     * @public
     */
    this.postData = function (data, endOfUrl) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            var jsonString = JSON.stringify(data);
            var url = _beginOfUrl + activeOrder.id + endOfUrl;
            xhr.open("POST", url);
            xhr.addEventListener("load", function () {
                if (xhr.status < 400) {
                    resolve(data);
                } else {
                    reject(new Error("Post request is failed: " + xhr.statusText));
                }
            });

            xhr.addEventListener("error", function () {
                reject(new Error("Network error"));
            });

            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.send(jsonString);
        });
    };

    /**
     * 
     * @param {Object} Product new product without property "orderId"
     * 
     * @returns {Obeject} product which contains property "orderId"
     */
    this.attachOrderToNewProduct = function (Product) {
        Product.orderId =  activeOrder.id;
        return Product;
    };

    /**
     * Do the request to put new order object.
     * 
     * @param {Object} order new order obeject created by user.
     * 
     * @returns {Promise} the promise object will be resolved when PUT new order request is loaded.
     * 
     * @public
     */
    this.putNewOrder = function (order) {
        return new Promise(function (resolve, reject) {

                var xhr = new XMLHttpRequest();
                var jsonString = JSON.stringify(order);
                xhr.open("PUT", _ordersUrl, true);
                xhr.addEventListener("load", function () {
                    if (xhr.status < 400) {
                        resolve();
                    } else {
                        reject(new Error("Post request is failed: " + xhr.statusText));
                    }
                });
                xhr.addEventListener("error", function () {
                    reject(new Error("Network error"));
                });

                xhr.setRequestHeader("Content-Type", "application/json")
                xhr.send(jsonString);
        });
    };
}