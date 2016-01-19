app.controller('AddApartmentController', function($scope, $uibModalInstance, ApartmentFactory, AdminFactory, allNeighborhoods) {
    $scope.neighborhoods = allNeighborhoods;
    $scope.availabilityOptions = ["available", "unavailable", "pending"];
    $scope.termOptions = ["1 month", "3 months", "6 months", "1 year", "2 years"];
    $scope.pictureUrls = [];

    $scope.addNewPhotoField = function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        $scope.pictureUrls.push({
            value: ""
        });
    };

    $scope.saveApt = function() {
        var urlsToAttachToApartment = $scope.pictureUrls.map(function(urlObj) {
            return urlObj.value;
        });
        $scope.apartment.pictureUrls = urlsToAttachToApartment;
        AdminFactory.addApartment($scope.apartment)
            .then(function(savedApartment) {
                console.log("Here's the apartment you just saved…");
                console.log(savedApartment);
                $uibModalInstance.close(savedApartment);
            }).then(null, console.error);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
