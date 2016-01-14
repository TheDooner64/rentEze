app.factory('FavoritesFactory', function($http) {
    var fac = {
        getAllFavorites: function(userId) {
            console.log(userId);
            console.log("In the FavoritesFactory");
            // return $http.get('/api/users/' + userId + '/favorites/')
            //     .then(response => response.data)
        }
    };

    return fac;
});
