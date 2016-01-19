app.factory('OrderFactory', function($http) {
    var OrderFactory = {};

    OrderFactory.getAllOrders = function() {
        return $http.get('/api/orders')
        .then(function(res) {
            return res.data;
        }).then(null, console.log());
    };

    return OrderFactory;
});
