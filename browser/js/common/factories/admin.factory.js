app.factory('AdminFactory', function($http){
    var AdminFactory = {};

    AdminFactory.addApartment = function(aptInfo) {
        console.log('i am adding ', aptInfo)
        return $http.post('/api/apartments', aptInfo)
        .then(function(res) {
            return res.data;
        }).then(null, console.log);
    };

    AdminFactory.submitEdit = function(updatedApt) {
        console.log('i am updating ', updatedApt);
        var route = '/api/apartments/' + updatedApt._id;
        return $http.put(route, updatedApt)
        .then(function(res) {
            return res.data;
        }).then(null, console.log)
    };

    return AdminFactory;
});
