app.config(function ($stateProvider) {

    $stateProvider.state('map', {
        url: '/map',
        templateUrl: 'js/map/map.html',
        controller: 'MapCtrl'
    });

});

app.controller('MapCtrl', function ($scope, MapFactory) {
    $scope.map = MapFactory.initialize_gmaps();
});
