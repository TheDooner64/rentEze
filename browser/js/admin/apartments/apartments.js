app.config(function ($stateProvider) {

    $stateProvider.state('adminApt', {
        url: '/admin/apartments',
        templateUrl: 'js/admin/apartments/apartments.html',
        controller: 'AdminAptCtrl',
        data: {
            isAdmin: true
        },
        resolve: {
            apartments: function(ApartmentFactory) {
                return ApartmentFactory.getAllApartments();
            }
        }
    });

});

app.controller('AdminAptCtrl', function ($scope, AuthService, $state, apartments, AdminFactory) {
    $scope.apartments = apartments;
    $scope.add = false;

    // Adds new apartment to db
    $scope.submitNewApartment = function(aptInfo) {
        $scope.add = false;
        return AdminFactory.addApartment(aptInfo);
    };

    // Hides/shows add new apartment form
    $scope.toggleAdd = function() {
        if ($scope.add) $scope.add = false;
        else $scope.add = true;
    };

});
