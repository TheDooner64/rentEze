app.factory('ReviewFactory', function($http) {
    var ReviewFactory = {};

    ReviewFactory.addReview = function(review) {
        return $http.post('/api/reviews', review)
            .then(response => response.data);
    }

    ReviewFactory.getAllReviews = function(aptId) {
        return $http.get('/api/reviews/' + aptId)
            .then(response => response.data);
    };

    return ReviewFactory;
});
