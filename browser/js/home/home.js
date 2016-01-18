app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
            neighborhoods: function(NeighborhoodFactory) {
                return NeighborhoodFactory.getNeighborhoods();
            }
        }
    });
});

app.controller('HomeCtrl', function($scope, localStorageService, $state, neighborhoods) {
    $scope.neighborhoods = neighborhoods;
    $scope.search = function() {
        console.log($scope.query);
        $state.go('map', {
            lat: $scope.query.latLong.lat,
            lng: $scope.query.latLong.lng
        });
    }

    var fakeApt = {
        title: "Awesome Apartment",
        landlord: "Bobby McD",
        numBedrooms: 5,
        numBathrooms: 3
    };

    localStorageService.set('apartment', fakeApt);

    $scope.showStorage = function() {
        console.log("Here's the storage");
        var value = localStorageService.get('apartment');
        console.log(value);
        localStorageService.remove('apartment');
        console.log("Ok, now I cleared it");
        value = localStorageService.get('apartment');
        console.log(value);
    }
});
