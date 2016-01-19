app.factory('CheckoutFactory', function($http, AuthService, localStorageService) {
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
                }).then(function(response) {
                    var savedOrder = response.data;
                    // Send confirmation e-mail for logged in user
                    return $http.post('/api/users/' + savedOrder.buyer + '/mailer', savedOrder);
                }).then(function(confirmationEmail) {
                    var updates = {};
                    updates.availability = "pending";
                    return $http.put('/api/apartments/' + apartment._id, updates);
                }).then(null, console.error);
        } else {
            var orderToSendToDb = {
                apartment: apartment._id,
                priceAtTimeOfSale: apartment.monthlyPrice,
                dateSold: Date.now(),
                status: "processing"
            };

            // Update apartment in localStorage so it appears as "pending"
            var allCurrentFavorites = localStorageService.get('favorites');
            allCurrentFavorites.forEach(function(localApartment) {
                if (localApartment.apartment._id === apartment._id) {
                    localApartment.apartment.availability = "pending";
                }
                return localApartment;
            });
            localStorageService.set('favorites', allCurrentFavorites);

            return $http.post('/api/orders/', orderToSendToDb)
                .then(function(response) {
                    var updates = {};
                    updates.availability = "pending";
                    return $http.put('/api/apartments/' + apartment._id, updates);
                }).then(null, console.error);
        }
    }

    return CheckoutFactory;
})
