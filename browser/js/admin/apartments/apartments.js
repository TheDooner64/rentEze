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

app.controller('AdminAptCtrl', function($scope, AuthService, $state, apartments, AdminFactory, $uibModal, $log) {
    $scope.apartments = apartments;
    $scope.editApt = null;
    $scope.edit = false;
    $scope.add = false;

    console.log(apartments);

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

    // Edits apartment in db
    $scope.submitEdit = function(updatedApt) {
        console.log(updatedApt)
        $scope.edit = false;
        return AdminFactory.submitEdit(updatedApt);
    }

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

    // Hides update apartment form
    $scope.toggleEdit = function() {
        if ($scope.edit) $scope.edit = false;
        else $scope.edit = true;
    };


});
