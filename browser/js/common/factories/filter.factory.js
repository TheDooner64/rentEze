app.factory('FilterFactory', function($http) {

    var FilterFactory = {};

    // Helper function to turn an object into a query string
    // var serialize = function(filterCriteriaObj) {

    //     var filterCriteriaQueryString = [];

    //     for (var property in filterCriteriaObj)
    //         if (filterCriteriaObj.hasOwnProperty(property)) {
    //             filterCriteriaQueryString.push(encodeURIComponent(property) + "=" + encodeURIComponent(filterCriteriaObj[property]));
    //         }

    //     return filterCriteriaQueryString.join("&");
    // }

    // AJAX request to find apartments based on user's filters
    // NOTE: This route currently does not exist on the back-end
    FilterFactory.filterResults = function(filterCriteria) {
        console.log(filterCriteria);
        return $http.post("/api/apartments/filter", filterCriteria)
            .then(response => response.data)
            .then(null, console.error);
    }

    return FilterFactory;
});
