app.factory('AdminFactory', function($http){
    var AdminFactory = {};

    AdminFactory.addApartment = function(aptInfo) {
        console.log('i am adding ', aptInfo)
        return $http.post('/api/apartments', aptInfo)
        .then(function(res) {
            return res.data;
        }).then(null, console.error);
    };

    AdminFactory.updateApartment = function(aptToUpdate) {
        var route = '/api/apartments/' + aptToUpdate._id;
        return $http.put(route, aptToUpdate)
        .then(function(res) {
            return res.data;
        }).then(null, console.error);
    };

    AdminFactory.updateUser = function(userToUpdate, fieldsToUpdate) {
        return $http.put('/api/users/' + userToUpdate._id, fieldsToUpdate)
            .then(function(response) {
                return response.data;
            }).then(null, console.error);
    };

    AdminFactory.deleteUser = function(userToDelete) {
        return $http.delete('/api/users/' + userToDelete._id)
            .then(function(response) {
                return response.data;
            }).then(null, console.error);
    };

    AdminFactory.resetPassword = function(userToReset) {
        return $http.post('/api/users/' + userToReset + '/reset');
    }

    return AdminFactory;
});
