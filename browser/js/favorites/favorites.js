app.config(function($stateProvider) {

    $stateProvider.state('favorites', {
        url: '/favorites',
        templateUrl: 'js/favorites/favorites.html',
        controller: 'FavoritesCtrl',
        resolve: {
            allFavorites: function(FavoritesFactory) {
                return FavoritesFactory.getAllFavorites();
            }
        }
    });

});

app.controller('FavoritesCtrl', function($scope, FavoritesFactory, allFavorites) {

    if (allFavorites.length >= 1) $scope.favorites = allFavorites;

});
