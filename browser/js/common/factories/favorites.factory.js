app.factory('FavoritesFactory', function($http, AuthService, localStorageService) {
    var FavoritesFactory = [];
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
            return $http.get('/api/users/' + user._id + '/favorites')
                .then(function(response) {
                    return response.data;
                }).then(null, console.error);
        } else {
            console.log("Ain't no user here!");
            if (localStorageService.get('favorites') === null) {
                localStorageService.set('favorites', []);
            } else {
                return localStorageService.get('favorites');
            }
        }
    }

    FavoritesFactory.addFavorite = function(apartment) {
        if (user) {
            return $http.post('/api/users/' + user + '/favorites', apartment)
                .then(function(response) {
                    return response.data;
                }).then(null, console.error);
        } else {
            if (localStorageService.get('favorites') === null) {
                // If there are no favorites saved yet
                var arr = new Array(apartment);
                localStorageService.set('favorites', arr);
            } else {
                // Find all currently stored favorites
                var allCurrentFavorites = localStorageService.get('favorites');

                console.log("Has this favorite already been saved to localStorage?");
                var aptIsAlreadySaved = allCurrentFavorites.filter(function(favorite) {
                    if (favorite._id === apartment._id) { return true; }
                }).length;

                if (aptIsAlreadySaved > 0) {
                    console.log("Yup, it's already been saved! My work is done here.");
                } else {
                    console.log("Nope, it hasn't already been saved. I'll save it now!");
                    // Add the current apartment to that object, if that apartment isn't already in the favorites
                    allCurrentFavorites.push(apartment);
                    // Re-set that object on localStorage
                    localStorageService.set('favorites', allCurrentFavorites);
                }
            }
            console.log("And here's what in 'favorites' in localStorage, now that all that work is done…");
            console.log(localStorageService.get('favorites'));
        }
    }

    return FavoritesFactory;
});
