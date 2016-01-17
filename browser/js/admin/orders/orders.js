app.config(function ($stateProvider) {

    $stateProvider.state('adminOrder', {
        url: '/admin/orders',
        templateUrl: 'js/admin/orders.html',
        controller: 'AdminOrderCtrl',
        data: {
            isAdmin: true
        }
    });

});

app.controller('AdminOrderCtrl', function ($scope, AuthService, $state, AdminFactory) {
    
});
