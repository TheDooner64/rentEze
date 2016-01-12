app.config(function ($stateProvider) {

    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'js/map/map.html',
        controller: 'MapCtrl'
    });

});

app.controller('MapCtrl', function ($scope, MapFactory) {
    $scope.map = MapFactory.initialize_gmaps();

    $scope.bedroomOptions = ["Studio", "1", "2", "3+"];
    $scope.rentOptions = ["$1000 or less", "$1000-$1250", "$1250-$1500", "$1500-$1750", "$1750-$2000", "$2000-$2250", "$2250-$2500"];
    $scope.ratingOptions = ["1", "2", "3", "4", "5"];
    $scope.termOfLease = ["1 month", "3 months", "6 months", "1 year", "2 years"];

    $scope.filterResults = function() {
        console.log($scope.filterCriteria);
    };
});
