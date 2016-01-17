app.config(function($stateProvider) {

    $stateProvider.state('favorites', {
        url: '/favorites',
        templateUrl: 'js/favorites/favorites.html',
        controller: 'FavoritesCtrl',
        resolve: {
            loggedInUser: function(AuthService) {
                return AuthService.getLoggedInUser();
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
        console.log("Here's the result of allFavorites");
        console.log(allFavorites);
        $scope.favorites = allFavorites;
    }

    $scope.removeFavorite = function(favorite) {
        console.log("This is the favorite we want to remove");
        console.log(favorite);
        if (loggedInUser) {
            console.log("Getting here too!");
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

    // console.log("Here's what's on the $scope.favorites…");
    // console.log($scope.favorites);
    // console.log("Here's what's on the localStorage 'favorites' key…");
    // console.log(localStorageService.get('favorites'));

});
