app.config(function($stateProvider) {

    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'js/map/map.html',
        controller: 'MapCtrl',
        resolve: {
            apartments: function(ApartmentFactory) {
                return ApartmentFactory.getAllApartments();
            }
        }
    });

});

app.controller('MapCtrl', function($scope, MapFactory, FilterFactory, ReviewFactory, apartments) {
    $scope.isCollapsed = true;
    $scope.map = MapFactory.initialize_gmaps();
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



    // Place to store all of the currentMarkers, in case we need it
    $scope.currentMarkers = [];

    $scope.selectApartment = function() {
        console.log("This ran!");
        $scope.apartmentIsSelected = true;
        $scope.$apply();
    }

    $scope.closeApartmentSelectPanel = function() {
        $scope.apartmentIsSelected = false;
    }

    // Function to add the markers to the map
    var addMarkersToMap = function(apartments) {
        apartments.forEach(function(apartment) {
            if (apartment.latLong) {
                var createdMapMarker = MapFactory.drawLocation($scope.map, apartment, {
                    icon: "/assets/images/home.png"
                });
                createdMapMarker["apartmentId"] = apartment._id;

                // Add click event to marker
                createdMapMarker.addListener("click", $scope.selectApartment);

                $scope.currentMarkers.push(createdMapMarker);
            }
        });
    }

    var removeHalf = function() {
        for (var i = 0; i < $scope.currentMarkers.length; i++) {
            if (i < $scope.currentMarkers.length / 2) {
                $scope.currentMarkers[i].setMap(null);
            }
        }
    }

    $scope.filterResults = function() {
        FilterFactory.filterResults($scope.filterCriteria)
            .then(function(apartments) {
                console.log("Apartments found: ", apartments);
                var filteredIds = apartments.map(function(apartment) {
                    return apartment._id;
                });
                $scope.currentMarkers.forEach(function(marker) {
                    if (filteredIds.indexOf(marker["apartmentId"]) === -1) marker.setMap(null);
                    else marker.setMap($scope.map)
                })
            });
    }

    addMarkersToMap($scope.apartments);
    // Function to retrieve apartments based on user filters

    $scope.addReview = function() {
        $scope.review.aptId =
        ReviewFactory.addReview($scope.review)
            .then((addedReview) => {
                $scope.isCollapsed = true;
                $scope.reviewPosted = true;
                $scope.$digest();
            });
    };

});
