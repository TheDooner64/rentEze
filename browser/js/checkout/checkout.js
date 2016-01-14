app.config(function ($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/checkout', // Will need to change to /:userId/checkout
        templateUrl: 'js/checkout/checkout.html',
        controller: 'CheckoutCtrl'
    });

});

app.controller('CheckoutCtrl', function ($scope, AuthService, $state) {

});
