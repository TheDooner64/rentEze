app.controller('EditApartmentController', function($scope, apartment, $uibModalInstance, ApartmentFactory, AdminFactory, allNeighborhoods) {
    $scope.apartment = apartment;
    $scope.neighborhoods = allNeighborhoods;
    $scope.availabilityOptions = ["available", "unavailable", "pending"];
    $scope.termOptions = ["1 month", "3 months", "6 months", "1 year", "2 years"];

    $scope.saveApt = function() {
        // This doesn't update pictureUrls yet
        AdminFactory.updateApartment($scope.apartment)
            .then(function(updatedApartment) {
                $uibModalInstance.close(updatedApartment);
            }).then(null, console.error);
    };

    $scope.addNewPhotoField = function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        $scope.apartments.pictureUrls.push("");
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
