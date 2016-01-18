app.factory('CheckoutFactory', function($http, AuthService) {
    var CheckoutFactory = {};

    CheckoutFactory.sendCheckout = function(checkoutInfo, apartment) {
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
                    console.log("Ok! Your order was saved!");
                    var updates;
                    updates.availability = "pending";
                    return $http.put('/api/apartments/' + apartment._id, updates);
                }).then(function(savedApt) {
                    console.log("The following apartment is no longer available on the market…");
                    console.log(savedApt);
                }).then(null, console.error);
        } else {
            var orderToSendToDb = {
                apartment: apartment._id,
                priceAtTimeOfSale: apartment.monthlyPrice,
                dateSold: Date.now(),
                status: "Processing"
            };
            $http.post('/api/orders/', orderToSendToDb)
                .then(function(savedOrder) {
                    console.log("Ok! Your order was saved!");
                    var updates;
                    updates.availability = "pending";
                    return $http.put('/api/apartments/' + apartment._id, updates);
                }).then(function(savedApt) {
                    console.log("The following apartment is no longer available on the market…");
                    console.log(savedApt);
                }).then(null, console.error);
        }
    }

    return CheckoutFactory;
})
