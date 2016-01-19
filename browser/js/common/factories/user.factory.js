app.factory('UserFactory', function($http) {
    var UserFactory = {};

    UserFactory.getAllUsers = function() {
        return $http.get('/api/users')
        .then(function(res) {
            return res.data;
        }).then(null, console.log());
    };

    return UserFactory;
});
