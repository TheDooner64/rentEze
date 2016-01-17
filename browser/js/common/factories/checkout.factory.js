app.factory('CheckoutFactory', function($http) {
    var CheckoutFactory = {};

    CheckoutFactory.sendCheckout = function(checkoutInfo) {
        console.log(checkoutInfo);
    }

    return CheckoutFactory;
})
