app.factory('FavoritesFactory', function($http, AuthService, localStorageService) {
    var FavoritesFactory = [];

    FavoritesFactory.getAllFavorites = function() {
        return AuthService.getLoggedInUser()
            .then(function(user) {
                console.log("Getting all favorites, either from the back end, or localStorage…");
                if (user) {
                    console.log("There's a user logged in, so here are all their favorites…");
                    return $http.get('/api/users/' + user._id + '/favorites')
                        .then(function(response) {
                            console.log(response.data);
                            return response.data;
                        }).then(null, console.error);
                } else {
                    console.log("Ain't no user here!");
                    if (localStorageService.get('favorites') === null) {
                        console.log("No 'favorites' key in localStorage yet! Setting it to [] now!");
                        localStorageService.set('favorites', []);
                    } else {
                        console.log("There is a 'favorites' key already! Here's what its associated value is…");
                        console.log(localStorageService.get('favorites'));
                        return localStorageService.get('favorites');
                    }
                }
            }).then(null, console.error);
    };

    FavoritesFactory.addFavorite = function(apartment) {
        return AuthService.getLoggedInUser()
            .then(function(user) {

                if (user) {
                    var aptToSendToDb = {
                        apartment: apartment._id,
                        user: user._id
                    };
                    return $http.post('/api/users/' + user._id + '/favorites/', aptToSendToDb)
                        .then(function(response) {
                            return response.data;
                        }).then(null, console.error);
                } else {
                    // Set up the apartment object so we're sending the correctly formatted apartment
                    var aptToSendToDb = {
                        apartment: apartment
                    };
                    if (localStorageService.get('favorites') === null) {
                        // If there are no favorites saved yet
                        var arr = new Array(aptToSendToDb);
                        localStorageService.set('favorites', arr);

                    } else {
                        // Find all currently stored favorites
                        var allCurrentFavorites = localStorageService.get('favorites');

                        console.log("Has this favorite already been saved to localStorage?");
                        var aptIsAlreadySaved = allCurrentFavorites.filter(function(favorite) {
                            if (favorite._id === apartment._id) {
                                return true;
                            }
                        }).length;

                        if (aptIsAlreadySaved > 0) {
                            console.log("Yup, it's already been saved! My work is done here.");
                        } else {
                            console.log("Nope, it hasn't already been saved. I'll save it now!");
                            // Add the current apartment to that object, if that apartment isn't already in the favorites
                            allCurrentFavorites.push(aptToSendToDb);
                            // Re-set that object on localStorage
                            localStorageService.set('favorites', allCurrentFavorites);
                        }
                    }
                    console.log("And here's what in 'favorites' in localStorage, now that all that work is done…");
                    console.log(localStorageService.get('favorites'));
                }

            });
    };

    FavoritesFactory.removeFavorite = function(favorite) {
        return AuthService.getLoggedInUser()
            .then(function(user) {
                if (user) {
                    console.log("Also getting here!!");
                    console.log("Here's the id for the favorite I want to delete…");
                    console.log(favorite._id);
                    return $http.delete('/api/users/' + user._id + '/favorites/' + favorite._id)
                        .then(function(response) {
                            console.log("Ok! That favorite is now deleted! Yay!");
                        }).then(null, console.error);
                } else {
                    var favorites = localStorageService.get('favorites');
                    favorites.forEach(function(fave, index) {
                        if (fave.apartment._id === favorite._id) favorites.splice(index, 1);
                    });
                    localStorageService.set('favorites', favorites);
                }

            });
    };

    return FavoritesFactory;
});
