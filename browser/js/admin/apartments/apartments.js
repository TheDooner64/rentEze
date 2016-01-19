app.config(function($stateProvider) {

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

app.controller('AdminAptCtrl', function($scope, AuthService, $state, apartments, AdminFactory, $uibModal, $log, ApartmentFactory) {
    $scope.apartments = apartments;

    // Adds new apartment to db
    $scope.addApartment = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'js/admin/apartments/add-apartment.html',
            controller: 'AddApartmentController',
            resolve: {
                allNeighborhoods: function(NeighborhoodFactory) {
                    return NeighborhoodFactory.getNeighborhoods();
                }
            }
        });

        modalInstance.result
            .then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

    // Puts the apartment info you want to edit on the scope
    $scope.editApartment = function(apt) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'js/admin/apartments/edit-apartment.html',
            controller: 'EditApartmentController',
            resolve: {
                apartment: function() {
                    return apt;
                },
                allNeighborhoods: function(NeighborhoodFactory) {
                    return NeighborhoodFactory.getNeighborhoods();
                }
            }
        });

        modalInstance.result
            .then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

    $scope.deleteApartment = function(apt) {
        AdminFactory.deleteApartment(apt)
            .then(function() {
                return ApartmentFactory.getAllApartments();
            }).then(function(allApartments) {
                $scope.apartments = allApartments
            }).then(null, console.error);
    };


});
