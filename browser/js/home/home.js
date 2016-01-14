app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function ($scope, $state, neighborhoods){
            $scope.neighborhoods = neighborhoods;
            console.log($scope.neighborhoods)
            $scope.search = function (){
                $state.go('map', {query:$scope.query})
            }
        },
        resolve: {
            neighborhoods: function(NeighborhoodFactory){
                return NeighborhoodFactory.getNeighborhoods();
            }
        }
    });
});
