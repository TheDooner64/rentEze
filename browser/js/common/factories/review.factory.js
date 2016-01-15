app.factory('ReviewFactory', function($http) {
    var fac = {
        addReview: function(review) {
            return $http.post('/api/reviews', review)
                .then(review => review.data);
        }
    };

    return fac;
});
