app.config(function ($stateProvider) {

    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'js/map/map.html',
        controller: 'MapCtrl'
    });

});

app.controller('MapCtrl', function ($scope, MapFactory, FilterFactory) {
    $scope.map = MapFactory.initialize_gmaps();

    $scope.bedroomOptions = ["Studio", "1", "2", "3+"];
    $scope.rentOptions = ["$1000 or less", "$1000-$1250", "$1250-$1500", "$1500-$1750", "$1750-$2000", "$2000-$2250", "$2250-$2500"];
    $scope.ratingOptions = ["1", "2", "3", "4", "5"];
    $scope.termOfLease = ["1 month", "3 months", "6 months", "1 year", "2 years"];

    // Function to retrieve apartments based on user filters
    $scope.filterResults = function() {
        FilterFactory.filterResults($scope.filterCriteria)
        .then(function(apartments) {
            console.log(apartments);
        });
    }
});
