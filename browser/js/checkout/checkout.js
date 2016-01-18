app.config(function($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/checkout/:aptId',
        templateUrl: 'js/checkout/checkout.html',
        controller: 'CheckoutCtrl',
        resolve: {
            loggedInUser: function(AuthService) {
                return AuthService.getLoggedInUser();
            },
            selectedApt: function(ApartmentFactory, $stateParams) {
                return ApartmentFactory.getOneApartment($stateParams.aptId);
            }
        }
    });

});

app.controller('CheckoutCtrl', function($scope, loggedInUser, CheckoutFactory, selectedApt) {
    $scope.apartment = selectedApt;
    $scope.isLoading = false;
    $scope.messages = ["Checking your credit score…", "Preparing application…", "Finalizing details…", "Submitting application…"];
    $scope.currentMessage;

    var prepareApplication = function() {
        $scope.messages.forEach(function(message, index) {
            setTimeout(function() {
                console.log("index", index);
                console.log("message", message);
                $scope.currentMessage = message;
                $scope.$apply();
                if (index === 3) {
                    $scope.isLoading = false;
                    $scope.showFinalPage = true;
                    $scope.$apply();
                }
            }, Math.floor(Math.random() * 3000));
        });
    };

    $scope.sendCheckout = function(checkoutInfo) {
        $scope.isLoading = true;
        prepareApplication();
        CheckoutFactory.sendCheckout(checkoutInfo, $scope.apartment);
    };



});
