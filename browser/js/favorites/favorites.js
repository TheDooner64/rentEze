app.config(function($stateProvider) {

    $stateProvider.state('favorites', {
        url: '/favorites',
        templateUrl: 'js/favorites/favorites.html',
        controller: 'FavoritesCtrl',
        resolve: {
            getLoggedInUser: function(AuthService) {
                return AuthService.getLoggedInUser();
            },
            allFavorites: function(FavoritesFactory) {
                return FavoritesFactory.getAllFavorites();
            }
        }
    });

});

app.controller('FavoritesCtrl', function($scope, allFavorites, getLoggedInUser) {

    console.dir(getLoggedInUser.toString());

    // getLoggedInUser().then(function(user) {
    //     $scope.user = user;
    //     console.log("This should be the user");
    //     console.log($scope.user);
    // });


});
