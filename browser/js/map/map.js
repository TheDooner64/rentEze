app.config(function($stateProvider) {

    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'js/map/map.html',
        controller: 'MapCtrl',
        resolve:{
            apartments: function(ApartmentFactory){
                return ApartmentFactory.getAllApartments()
            }
        }
    });

});

app.controller('MapCtrl', function($scope, MapFactory, FilterFactory, apartments) {
    $scope.map = MapFactory.initialize_gmaps();
    $scope.apartments=apartments;

    // Change bedroom options to numbers so they match database
    // Need to figure out how to display 0 as "studio" on front end, and handle the 3+
    $scope.bedroomOptions = ["Studio", "1", "2", "3+"];
    $scope.ratingOptions = [1, 2, 3, 4, 5];
    $scope.termOfLease = ["1 month", "3 months", "6 months", "1 year", "2 years"];

    // Place to store all of the currentMarkers, in case we need it
    $scope.currentMarkers = [];

    // Function to add the markers to the map
    var addMarkersToMap = function(apartments) {
        apartments.forEach(function(apartment) {
            if (apartment.latLong){
                var createdMapMarker = MapFactory.drawLocation($scope.map, apartment, {
                    icon: "/assets/images/home.png"
                });
                createdMapMarker["apartmentId"] = apartment._id;
                $scope.currentMarkers.push(createdMapMarker);
            }
        });
        console.log($scope.currentMarkers)
    }
    var removeHalf = function(){
        for (var i = 0; i< $scope.currentMarkers.length; i++){
            if(i< $scope.currentMarkers.length/2){
                console.log("hi")
                $scope.currentMarkers[i].setMap(null);
            }
        }
    }

    $scope.filterResults = function() {
        FilterFactory.filterResults($scope.filterCriteria)
            .then(function(apartments) {
                console.log("Apartments found: ", apartments);
                var filteredIds = apartments.map(function(apartment){
                    return apartment._id;
                });
                currentMarkers.forEach(function(marker){
                    if(filteredIds.indexOf(marker["apartmentId"]) === -1 ){
                        marker.setMap(null);
                    }
                })
            });
    }

// neighborhoodQuery = "https://maps.googleapis.com/maps/api/geocode/json?address=" +city + state + "&components=locality:" +neighborhood + "&key= + apiKey"

    addMarkersToMap($scope.apartments)
    // Function to retrieve apartments based on user filters

    // This is just for testing the child state, delete later
    // $scope.showChildState = () => {
    // }

});
