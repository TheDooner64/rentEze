app.factory('ApartmentFactory', function($http){
    var ApartmentFactory = {};
    ApartmentFactory.getAllApartments = function(){
        return $http.get('/api/apartments')
        .then(function(response){return response.data}).then(null, console.log)
    }
    return ApartmentFactory;
})
