app.factory('FilterFactory', function() {

    var FilterFactory = {};

    // BOBBY NOTE: We don't need this if we do the filtering on the front-end

    // AJAX request to find apartments based on user's filters
    // FilterFactory.filterResults = function(filterCriteria) {
    //     return $http.post("/api/apartments/filter", filterCriteria)
    //         .then(response => response.data)
    //         .then(null, console.error);
    // }

    return FilterFactory;
});
