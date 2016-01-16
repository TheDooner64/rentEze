app.factory('ReviewFactory', function($http) {
    var fac = {
        addReview: function(review) {
            return $http.post('/api/reviews', review)
                .then(function(response) {
                    return response.data;
                });
        },
        getAllReviews: function(aptId) {
            return $http.get('/api/reviews/' + aptId)
                .then(function(response) {
                    return response.data;
                });
        }
    };

    return fac;
});
