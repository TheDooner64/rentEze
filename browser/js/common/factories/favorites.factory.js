app.factory('FavoritesFactory', function($http, AuthService, localStorageService, $q) {
    var FavoritesFactory = [];

    var moveFavoritesToUser = function(user) {
        var arrOfFavoritePromises;

        // Store favorites from the local storage as a variable
        var favoritesInLocalStorage = localStorageService.get('favorites');

        // Clear out the local storage
        localStorageService.remove('favorites');

        // If favorites existed in local storage, add them to the database
        if (favoritesInLocalStorage) {
            arrOfFavoritePromises = favoritesInLocalStorage.map(function(favorite) {
                favorite.user = user._id;
                return $http.post('/api/users/' + user._id + '/favorites/', favorite);
            });
            return $q.all(arrOfFavoritePromises).then(null, console.error);
        } else {
            return;
        }
    };

    FavoritesFactory.getAllFavorites = function() {
        var loggedInUser = null;
        if (AuthService.isAuthenticated()) {
            return AuthService.getLoggedInUser()
                .then(function(user) {
                    loggedInUser = user;
                    return moveFavoritesToUser(user);
                }).then(function(migratedFavorites) {
                    return $http.get('/api/users/' + loggedInUser._id + '/favorites');
                }).then(function(response) {
                    return response.data;
                }).then(null, console.error);
        } else {
            if (localStorageService.get('favorites') === null) {
                localStorageService.set('favorites', []);
            } else {
                return localStorageService.get('favorites');
            }
        }
    };

    FavoritesFactory.addFavorite = function(apartment) {
        if (AuthService.isAuthenticated()) {
            var user;
            return AuthService.getLoggedInUser()
                .then(function(loggedInUser) {
                    user = loggedInUser;
                    var aptToSendToDb = {
                        apartment: apartment._id,
                        user: user._id
                    };

                    return $http.post('/api/users/' + user._id + '/favorites/', aptToSendToDb);

                }).then(function(response) {
                    console.log("Ok! Apartment sent to the back-end to be saved!")
                    return response.data;
                }).then(null, console.error);
        } else {
            var allCurrentFavorites = localStorageService.get('favorites');
            var aptToSendToDb = {
                apartment: apartment
            };
            // If there are no favorites saved yet
            // The second condition here (checking if allCurrentFavorites[0] contains null
            // is just for weird buggy behavior that happens from time to time)
            if (allCurrentFavorites === null || allCurrentFavorites[0] === null) {
                var arr = new Array(aptToSendToDb);
                localStorageService.set('favorites', arr);
            } else {
                var aptIsAlreadySaved = allCurrentFavorites.filter(function(favorite) {
                    if (favorite.apartment._id === apartment._id) {
                        return true;
                    }
                }).length;

                if (aptIsAlreadySaved > 0) {} else {
                    // Set up the apartment object so we're sending the correctly formatted apartment
                    // Add the current apartment to that object, if that apartment isn't already in the favorites
                    allCurrentFavorites.push(aptToSendToDb);
                    // Re-set that object on localStorage
                    localStorageService.set('favorites', allCurrentFavorites);
                }
            }
        }
    };

    FavoritesFactory.removeFavorite = function(favorite) {
        if (AuthService.isAuthenticated()) {
            return AuthService.getLoggedInUser()
                .then(function(user) {
                    return $http.delete('/api/users/' + user._id + '/favorites/' + favorite._id);
                }).then(function(response) {
                    console.log("Ok! That favorite is now deleted! Yay!");
                }).then(null, console.error);
        } else {
            var favorites = localStorageService.get('favorites');
            favorites.forEach(function(fave, index) {
                if (fave.apartment._id === favorite.apartment._id) {
                    favorites.splice(index, 1);
                }
            });
            localStorageService.set('favorites', favorites);
        }
    };

    return FavoritesFactory;
});
