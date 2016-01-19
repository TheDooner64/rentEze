app.controller('EditApartmentController', function($scope, apartment, $uibModalInstance, ApartmentFactory, AdminFactory, allNeighborhoods) {
    $scope.apartment = apartment;
    $scope.neighborhoods = allNeighborhoods;

    $scope.saveApt = function() {
        AdminFactory.updateApartment($scope.apartment)
            .then(function(updatedApartment){
                $uibModalInstance.close(updatedApartment);
            }).then(null, console.error);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
