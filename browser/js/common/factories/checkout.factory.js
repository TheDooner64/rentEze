app.factory('CheckoutFactory', function($http, AuthService) {
    var CheckoutFactory = {};

    var sendConfirmationEmail = function() {

    };

    CheckoutFactory.sendCheckout = function(checkoutInfo, apartment) {

        var checkoutInfoForMailer = checkoutInfo;

        if (AuthService.isAuthenticated()) {
            return AuthService.getLoggedInUser()
                .then(function(user) {
                    var orderToSendToDb = {
                        apartment: apartment._id,
                        buyer: user._id,
                        priceAtTimeOfSale: apartment.monthlyPrice,
                        dateSold: Date.now(),
                        status: "processing"
                    };
                    return $http.post('/api/orders/', orderToSendToDb);
                }).then(function(savedOrder) {
                    var updates = {};
                    updates.availability = "pending";
                    return $http.put('/api/apartments/' + apartment._id, updates);
                }).then(function(savedApt) {
                }).then(null, console.error);
        } else {
            var orderToSendToDb = {
                apartment: apartment._id,
                priceAtTimeOfSale: apartment.monthlyPrice,
                dateSold: Date.now(),
                status: "processing"
            };
            return $http.post('/api/orders/', orderToSendToDb)
                .then(function(savedOrder) {
                    var updates = {};
                    updates.availability = "pending";
                    return $http.put('/api/apartments/' + apartment._id, updates);
                }).then(function(savedApt) {
                    // Mailer
                }).then(null, console.error);
        }
    }

    return CheckoutFactory;
})
