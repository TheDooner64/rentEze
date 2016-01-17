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
    // Need to figure out the best way to get the user data to pre-load in the form
    console.log(loggedInUser);

    $scope.isLoading = false;

    $scope.sendCheckout = function(checkoutInfo) {
        CheckoutFactory.sendCheckout(checkoutInfo);
        $scope.isLoading = true;
    }

});
