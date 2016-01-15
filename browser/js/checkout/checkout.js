app.config(function ($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/checkout', // Will need to change to /:userId/checkout
        templateUrl: 'js/checkout/checkout.html',
        controller: 'CheckoutCtrl',
        resolve: {
            loggedInUser: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });

});

app.controller('CheckoutCtrl', function ($scope, loggedInUser, CheckoutFactory) {
    console.log(loggedInUser);

    $scope.sendCheckout = CheckoutFactory.sendCheckout;
});
