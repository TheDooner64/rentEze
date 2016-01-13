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
    $scope.bedroomOptions = ["Studio", "1", "2", "3+"];
    $scope.ratingOptions = [1, 2, 3, 4, 5];
    $scope.termOfLease = ["1 month", "3 months", "6 months", "1 year", "2 years"];

    // Place to store all of the currentMarkers, in case we need it
    $scope.currentMarkers = [];

    var fakeLatLongObject = {
        latLng: {
            lat: 40.705189,
            lng: -74.009209
        },
        title: "My fake apartment!"
    }

    // Function to add a market to the map
    // NOTE: Need to figure out how to access the relevant map data that google needs
    var addMarkersToMap = function(apartments) {

        // apartments.forEach(function(apartment) {
        //     var createdMapMarker = MapFactory.drawLocation($scope.map, apartment.latLong, {
        //         icon: "/assets/images/star-3.png"
        //     });
        //     createdMapMarker["apartmentName"] = apartment.title;
        //     $scope.currentMarkers.push(createdMapMarker);
        // });

        var createdMapMarker = MapFactory.drawLocation($scope.map, apartments, {
            icon: "/assets/images/star-3.png"
        });
        createdMapMarker["apartmentName"] = apartments.title;
        $scope.currentMarkers.push(createdMapMarker);
    }

    // Function to retrieve apartments based on user filters
    $scope.filterResults = function() {
        console.log("Adding fake apt: ", fakeLatLongObject);
        addMarkersToMap(fakeLatLongObject);

        // FilterFactory.filterResults($scope.filterCriteria)
        //     .then(function(apartments) {
        //         console.log(apartments);
        //         addMarkersToMap(apartments);
        //     });
    }

});
