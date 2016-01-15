app.factory('FavoritesFactory', function($http, AuthService) {
    var FavoritesFactory = {};

    // NOTE: Need to figure out if there's an easier way to access the current user
    var loggedInUser = AuthService.getLoggedInUser();

    FavoritesFactory.getAllFavorites = function() {
        loggedInUser.then(function(user) {
            // NOTE: Need to add a route to retrieve a user's favorites
            // return $http.get('/api/users/' + user._id + '/favorites/')
            // .then(response => response.data)
        });
    }

    FavoritesFactory.addFavorite = function() {
        loggedInUser.then(function(user) {
            // Need to add route to add a favorite
        });
    }

    return FavoritesFactory;
});
