app.factory('NeighborhoodFactory', function ($http) {
    var NeighborhoodFactory = {};
    NeighborhoodFactory.getNeighborhoods = function(){
        return $http.get('/api/neighborhoods')
        .then(function(response){return response.data}).then(null, console.log)
    }
    return NeighborhoodFactory
})
