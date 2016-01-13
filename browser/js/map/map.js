app.config(function($stateProvider) {

    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'js/map/map.html',
        controller: 'MapCtrl'
    });

});

app.controller('MapCtrl', function($scope, MapFactory, FilterFactory) {
    $scope.map = MapFactory.initialize_gmaps();

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

    // Place to store all of the currentMarkers, in case we need it
    $scope.currentMarkers = [];

    // Function to add the markers to the map
    var addMarkersToMap = function(apartments) {
        apartments.forEach(function(apartment) {
            var createdMapMarker = MapFactory.drawLocation($scope.map, apartment, {
                icon: "/assets/images/star-3.png"
            });
            createdMapMarker["apartmentName"] = apartment.title;
            $scope.currentMarkers.push(createdMapMarker);
        });
    }

    // Function to retrieve apartments based on user filters
    $scope.filterResults = function() {
        FilterFactory.filterResults($scope.filterCriteria)
            .then(function(apartments) {
                console.log("Apartments found: ", apartments);
                addMarkersToMap(apartments);
            });
    }

    // This is just for testing the child state, delete later
    // $scope.showChildState = () => {
    // }

});
