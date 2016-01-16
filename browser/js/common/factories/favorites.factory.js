app.factory('FavoritesFactory', function($http, AuthService, localStorageService) {
    var FavoritesFactory = {};

    var user;

    if (AuthService.isAuthenticated) {
        // NOTE: Need to figure out if there's an easier way to access the current user
        AuthService.getLoggedInUser()
            .then(function(loggedInUser) {
                user = loggedInUser;
            }).then(null, console.error);
    }

    FavoritesFactory.getAllFavorites = function() {
        if (user) {
            return $http.get('/api/users/' + user._id + '/favorites/')
                .then(response => response.data)
                .then(null, console.error);
        } else {
            console.log("Ain't no user here!");
            if (localStorageService.get('favorites') === null) {
                localStorageService.set('favorites', []);
            } else {
                return localStorageService.get('favorites');
            }
        }
    }

    FavoritesFactory.addFavorite = function() {
        AuthService.loggedInUser.then(function(user) {
            // Need to add route to add a favorite
        });
    }

    return FavoritesFactory;
});
