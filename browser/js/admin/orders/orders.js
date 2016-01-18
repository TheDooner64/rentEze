app.config(function ($stateProvider) {

    $stateProvider.state('adminOrder', {
        url: '/admin/orders',
        templateUrl: 'js/admin/orders/orders.html',
        controller: 'AdminOrderCtrl',
        data: {
            isAdmin: true
        },
        resolve: {
            orders: function(OrderFactory) {
                return OrderFactory.getAllOrders();
            }
        }
    });

});

app.controller('AdminOrderCtrl', function ($scope, AuthService, $state, AdminFactory, orders) {
    $scope.orders = orders;

});
