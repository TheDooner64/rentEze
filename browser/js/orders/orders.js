app.config(function($stateProvider) {

    $stateProvider.state('orders', {
        url: '/orders',
        templateUrl: 'js/orders/orders.html',
        controller: 'OrdersCtrl',
        resolve: {
            loggedInUser: function(AuthService) {
                if (AuthService.isAuthenticated()) return AuthService.getLoggedInUser();
            },
            allOrders: function(OrdersFactory) {
                return OrdersFactory.getAllOrders();
            }
        }
    });

});

app.controller('OrdersCtrl', function($scope, OrdersFactory, loggedInUser, allOrders) {
    $scope.user = loggedInUser;
    $scope.orders = allOrders;

    $scope.cancelOrder = function(orderToCancel) {
        OrdersFactory.cancelOrder(orderToCancel)
        .then(function() {
            return OrdersFactory.getAllOrders();
        }).then(function(ordersFromDatabase) {
            $scope.orders = ordersFromDatabase;
        });
    }
});
