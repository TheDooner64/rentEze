app.factory('FavoritesFactory', function($http, AuthService, localStorageService, $q) {
    var FavoritesFactory = [];

    FavoritesFactory.getAllFavorites = function() {
        console.log("Getting all favorites, either from the back end, or localStorage…");
        console.log("Is there a logged in user?");
        console.log(AuthService.isAuthenticated());

        if (AuthService.isAuthenticated()) {
            return AuthService.getLoggedInUser()
                .then(function(user) {
                    console.log("There's a user logged in, so here are all their favorites…");
                    return $http.get('/api/users/' + user._id + '/favorites');
                }).then(function(response) {
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
    };

    FavoritesFactory.addFavorite = function(apartment) {
        console.log("Here's the thing we want to add to favorites…");
        console.log(apartment);
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
                console.log("Ok! Apartment saved!")
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
                console.log("Has this favorite already been saved to localStorage?");
                var aptIsAlreadySaved = allCurrentFavorites.filter(function(favorite) {
                    if (favorite.apartment._id === apartment._id) {
                        return true;
                    }
                }).length;

                if (aptIsAlreadySaved > 0) {
                    console.log("Yup, it's already been saved! My work is done here.");
                } else {
                    console.log("Nope, it hasn't already been saved. I'll save it now!");
                    // Set up the apartment object so we're sending the correctly formatted apartment
                    // Add the current apartment to that object, if that apartment isn't already in the favorites
                    allCurrentFavorites.push(aptToSendToDb);
                    // Re-set that object on localStorage
                    localStorageService.set('favorites', allCurrentFavorites);
                }
            }
            console.log("And here's what in 'favorites' in localStorage, now that all that work is done…");
            console.log(localStorageService.get('favorites'));
        }
    };

    FavoritesFactory.removeFavorite = function(favorite) {
        if (AuthService.isAuthenticated()) {
            return AuthService.getLoggedInUser()
                .then(function(user) {
                    console.log("Also getting here!!");
                    console.log("Here's the id for the favorite I want to delete…");
                    console.log(favorite._id);
                    return $http.delete('/api/users/' + user._id + '/favorites/' + favorite._id);
                }).then(function(response) {
                    console.log("Ok! That favorite is now deleted! Yay!");
                }).then(null, console.error);
        } else {
            var favorites = localStorageService.get('favorites');
            console.log("Here are all the favorites currently stored in localStorage…");
            console.log(favorites);
            favorites.forEach(function(fave, index) {
                if (fave.apartment._id === favorite.apartment._id) {
                    console.log("This is the fave we're going to remove from localStorage now…");
                    console.log(fave);
                    favorites.splice(index, 1);
                }
            });
            localStorageService.set('favorites', favorites);
        }
    };

    FavoritesFactory.moveFavoritesToUser = function() {
        var arrOfFavoritePromises;
        return AuthService.getLoggedInUser()
            .then(function(user) {
                console.log("Here is the user…");
                console.log(user);
                var favoritesInLocalStorage = localStorageService.get('favorites');
                console.log("Here are all the favorites in local storage…");
                console.log(favoritesInLocalStorage);
                console.log("Removing those favorites from localStorage now…");
                localStorageService.remove('favorites');
                if (favoritesInLocalStorage) {
                    arrOfFavoritePromises = favoritesInLocalStorage.map(function(favorite) {
                        favorite.user = user._id;
                        return $http.post('/api/users/' + user._id + '/favorites/', favorite);
                    });
                    $q.all(arrOfFavoritePromises)
                        .then(function(responses) {
                            console.log("All favorites moved to db!");
                            console.log("Here are each of the favorites saved in the db…");
                            responses.forEach(function(response) {
                                console.log(response.data);
                            });
                            return responses.data;
                        }).then(null, console.error);
                } else {
                    return;
                }
            }).then(null, console.error);
    };

    return FavoritesFactory;
});
