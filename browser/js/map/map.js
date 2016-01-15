app.config(function($stateProvider) {

    $stateProvider.state('map', {
        url: '/map/:query',
        templateUrl: 'js/map/map.html',
        controller: 'MapCtrl',
        resolve: {
            apartments: function(ApartmentFactory) {
                return ApartmentFactory.getAllApartments();
            },
            center: function(MapFactory, $stateParams) {
                return MapFactory.findCenter($stateParams.query)
            }
        }
    });

});

app.controller('MapCtrl', function($scope, MapFactory, FilterFactory, ReviewFactory, ApartmentFactory, apartments, center, $q) {
    $scope.center = center;
    $scope.isCollapsed = true;
    $scope.map = MapFactory.initialize_gmaps($scope.center);
    $scope.apartments = apartments;

    // Change bedroom options to numbers so they match database
    // Need to figure out how to display 0 as "studio" on front end, and handle the 3+
    $scope.bedroomOptions = [{
        name: "Studio",
        val: 0
    }, {
        name: "1",
        val: 1
    }, {
        name: "2",
        val: 2
    }, {
        name: "3",
        val: 3
    }, {
        name: "4+",
        val: 4
    }];

    $scope.ratingOptions = [1, 2, 3, 4, 5];
    $scope.termOfLease = ["1 month", "3 months", "6 months", "1 year", "2 years"];

    // Default to false so the side-panel is not displayed
    $scope.apartmentIsSelected = false;
    $scope.reviews;

    // This holds all of the current markers on the map
    $scope.currentMarkers = [];

    // Function to add a marker to the map
    var addMarkerToMap = function(apartment) {

        if (apartment.latLong) {

            var createdMapMarker = MapFactory.drawLocation($scope.map, apartment, {
                icon: "/assets/images/home.png"
            });

            // Add the apartment id to the marker object
            createdMapMarker.apartmentId = apartment._id;

            // Add click event to marker
            // createdMapMarker.addListener("click", $scope.selectApartment);
            createdMapMarker.addListener("click", function() {
                $q.all([ApartmentFactory.getOneApartment(createdMapMarker.apartmentId), ReviewFactory.getAllReviews(apartment._id)])
                    .then(function(results) {
                        console.log("results");
                        $scope.reviews = results[1];
                        console.log($scope.reviews);
                        $scope.selectApartment(results[0]);
                    }).then(null, console.log)
            });

            $scope.currentMarkers.push(createdMapMarker);
        }
    }

    // Adds all apartments to the map on initial page load
    $scope.apartments.forEach(function(apartment) {
        addMarkerToMap(apartment);
    });

    // Function to check all filter criteria
    var checkAllCriteria = function(apartmentToCheck) {

        // Helper functions to check each criteria
        var checkBedrooms = function() {
            if (!$scope.filterCriteria.numBedrooms) return true;
            if ($scope.filterCriteria.numBedrooms.val === apartmentToCheck.numBedrooms) return true;
            return false;
        }

        var checkRent = function() {
            var minRent = $scope.filterCriteria.monthlyPriceMin ? $scope.filterCriteria.monthlyPriceMin : 0;
            var maxRent = $scope.filterCriteria.monthlyPriceMax ? $scope.filterCriteria.monthlyPriceMax : 1000000000;

            if (apartmentToCheck.monthlyPrice >= minRent && apartmentToCheck.monthlyPrice <= maxRent) return true;
            return false;
        }

        var checkTerm = function() {
            if (!$scope.filterCriteria.termOfLease) return true;
            if ($scope.filterCriteria.termOfLease === apartmentToCheck.termOfLease) return true;
            return false;
        }

        // NOTE: Rating currently doesn't work
        // var checkRating = function() {
        //     if (!$scope.filterCriteria.averageRating) return true;
        //     if (apartmentToCheck.averageRating >= $scope.filterCriteria.averageRating - 0.5) return true;
        //     return false;
        // }

        if (!checkBedrooms()) return false;
        if (!checkRent()) return false;
        if (!checkTerm()) return false;
        // if (!checkRating()) return false;

        return true;
    }

    // Filter results based on the criteria the users submits
    $scope.filterResults = function() {
        // Reset all of the map markers. Not sure if there's a better way to do this
        $scope.currentMarkers.forEach(function(mapMarker) {
            mapMarker.setMap(null);
        });
        $scope.currentMarkers = [];

        // Loop over each apartment and check if a marker should be added
        $scope.apartments.forEach(function(apartmentToCheck) {
            if (checkAllCriteria(apartmentToCheck)) addMarkerToMap(apartmentToCheck);
        });
    }

    // BOBBY NOTE: What is this function doing? Do we need it?
    // var removeHalf = function() {
    //     for (var i = 0; i < $scope.currentMarkers.length; i++) {
    //         if (i < $scope.currentMarkers.length / 2) {
    //             $scope.currentMarkers[i].setMap(null);
    //         }
    //     }
    // }

    $scope.selectApartment = function(apartment) {
        $scope.apartmentIsSelected = true;
        $scope.apartment = apartment;
    }

    $scope.closeApartmentSelectPanel = function() {
        $scope.apartmentIsSelected = false;
        $scope.reviews = null;
    }

    $scope.addReview = function() {
        $scope.review.aptId = $scope.apartment._id
        ReviewFactory.addReview($scope.newReview)
            .then((addedReview) => {
                $scope.isCollapsed = true;
                $scope.reviewPosted = true;
                $scope.$digest();
            });
    };
    $scope.getNumReviews = function() {
        if (!$scope.reviews) return;
        if ($scope.reviews.length < 1) return "No Reviews for this Address";
        return $scope.reviews.length
    }
    $scope.displayTitle = function() {
        if (!$scope.apartment) return;
        var title = $scope.apartment.title.split(" ");
        if (parseInt(title[0]) === 0) {
            title.shift();
            title[0] = "Studio";
        }
        return title.join(" ");
    }
});
