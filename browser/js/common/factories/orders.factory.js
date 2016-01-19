app.factory('OrdersFactory', function($http, AuthService, $state) {
    var OrdersFactory = [];

    OrdersFactory.getAllOrders = function() {

        var loggedInUser = null;

        if (AuthService.isAuthenticated()) {
            return AuthService.getLoggedInUser()
                .then(function(user) {
                    return $http.get('/api/users/' + user._id + '/orders');
                }).then(function(response) {
                    return response.data;
                }).then(null, console.error);
        } else {
            console.log("Ain't no user here!");
        }
    }

    OrdersFactory.cancelOrder = function(orderToCancel) {

        var updates = {};
        updates.availability = "available";

        return $http.delete('/api/orders/' + orderToCancel._id)
            .then(function(response) {
                return $http.put('/api/apartments/' + orderToCancel.apartment._id, updates);
            }).then(null, console.error);

    }

    return OrdersFactory;
});
