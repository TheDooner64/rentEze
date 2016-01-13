app.config(function ($stateProvider) {

    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'js/map/map.html',
        controller: 'MapCtrl'
    });

});

app.controller('MapCtrl', function ($scope, MapFactory, FilterFactory) {
    $scope.map = MapFactory.initialize_gmaps();

    // Change bedroom options to numbers so they match database
    // Need to figure out how to display 0 as "studio" on front end, and handle the 3+
    $scope.bedroomOptions = ["Studio", "1", "2", "3+"];
    $scope.ratingOptions = [1, 2, 3, 4, 5];
    $scope.termOfLease = ["1 month", "3 months", "6 months", "1 year", "2 years"];

    // Function to retrieve apartments based on user filters
    $scope.filterResults = function() {
        FilterFactory.filterResults($scope.filterCriteria)
        .then(function(apartments) {
            console.log(apartments);
        });
    }
});
