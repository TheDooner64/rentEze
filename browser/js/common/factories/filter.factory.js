app.factory('FilterFactory', function ($http) {

    var FilterFactory = {};

    // AJAX request to find apartments based on user's filters
        // NOTE: This route currently does not exist on the back-end
    FilterFactory.filterResults = function(filterCriteria) {
        return $http.get("/api/filter")
        .then(response => response.data)
        .then(null, console.error);
    }

    return FilterFactory;
});
