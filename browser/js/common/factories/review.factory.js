app.factory('ReviewFactory', function($http) {
    var fac = {
        addReview: function(review) {
            return $http.post('/api/reviews', review)
                .then(review => review.data);
        }
    };
    fac.getAllReviews = function(aptId){
        return $http.get('/api/reviews/' + aptId)
            .then(review => review.data);
    };
    return fac;
});
