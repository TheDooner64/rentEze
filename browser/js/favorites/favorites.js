app.config(function($stateProvider) {

    $stateProvider.state('favorites', {
        url: '/favorites',
        templateUrl: 'js/favorites/favorites.html',
        controller: 'FavoritesCtrl',
        resolve: {
            loggedInUser: function(AuthService) {
                if (AuthService.isAuthenticated()) return AuthService.getLoggedInUser();
            },
            allFavorites: function(FavoritesFactory) {
                return FavoritesFactory.getAllFavorites();
            }
        }
    });

});

app.controller('FavoritesCtrl', function($scope, FavoritesFactory, localStorageService, loggedInUser, allFavorites) {

    // Line below for testing purposes
    // localStorageService.remove('favorites');

    if (allFavorites && allFavorites.length >= 1) {
        $scope.favorites = allFavorites;
    }

    $scope.removeFavorite = function(favorite) {
        if (loggedInUser) {
            FavoritesFactory.removeFavorite(favorite)
                .then(function() {
                    return FavoritesFactory.getAllFavorites();
                }).then(function(allFaves) {
                    $scope.favorites = allFaves;
                }).then(null, console.error);
        } else {
            FavoritesFactory.removeFavorite(favorite);
            $scope.favorites = localStorageService.get('favorites');
        }
    }

});
