app.factory('FilterFactory', function() {

    var FilterFactory = {};
        // Function to check all filter criteria
    FilterFactory.checkAllCriteria = function(filterCriteria, apartmentToCheck) {

        // Helper functions to check each criteria
        var checkBedrooms = function() {
            if (!filterCriteria.numBedrooms) return true;
            if (filterCriteria.numBedrooms.val === apartmentToCheck.numBedrooms) return true;
            return false;
        }

        var checkRent = function() {
            var minRent = filterCriteria.monthlyPriceMin ? filterCriteria.monthlyPriceMin : 0;
            var maxRent = filterCriteria.monthlyPriceMax ? filterCriteria.monthlyPriceMax : 1000000000;

            if (apartmentToCheck.monthlyPrice >= minRent && apartmentToCheck.monthlyPrice <= maxRent) return true;
            return false;
        }

        var checkTerm = function() {
            if (!filterCriteria.termOfLease) return true;
            if (filterCriteria.termOfLease === apartmentToCheck.termOfLease) return true;
            return false;
        }

        // NOTE: Rating currently doesn't work
        // var checkRating = function() {
        //     if (!filterCriteria.averageRating) return true;
        //     if (apartmentToCheck.averageRating >= filterCriteria.averageRating - 0.5) return true;
        //     return false;
        // }

        if (!checkBedrooms()) return false;
        if (!checkRent()) return false;
        if (!checkTerm()) return false;
        // if (!checkRating()) return false;

        return true;
    }

    FilterFactory.recommendApartments = function(apartments, user){
        if (!user){
            this.recommendOnFilters(apartments) //or user has no favoritest
        }
    };
    FilterFactory.updateAverages = function(filterCriteria){
        // max rent
        if (filterCriteria.monthlyPriceMax > 0 &&
            filterCriteria.monthlyPriceMax <= 1000) averages.maxRent["0-1000"].counter++;
        if (filterCriteria.monthlyPriceMax > 1000 &&
            filterCriteria.monthlyPriceMax <= 2000) averages.maxRent["1001-2000"].counter++;
        if (filterCriteria.monthlyPriceMax > 2000 &&
            filterCriteria.monthlyPriceMax <= 3000) averages.maxRent["2001-3000"].counter++;
        if (filterCriteria.monthlyPriceMax > 3000 &&
            filterCriteria.monthlyPriceMax <= 4000) averages.maxRent["3001-4000"].counter++;
        if (filterCriteria.monthlyPriceMax > 4000 &&
            filterCriteria.monthlyPriceMax <= 5000) averages.maxRent["4001-5000"].counter++;
        // min rent
        if (filterCriteria.monthlyPriceMin > 0 &&
            filterCriteria.monthlyPriceMin <= 1000) averages.minRent["0-1000"].counter++;
        if (filterCriteria.monthlyPriceMin > 1000 &&
            filterCriteria.monthlyPriceMin <= 2000) averages.minRent["1001-2000"].counter++;
        if (filterCriteria.monthlyPriceMin > 2000 &&
            filterCriteria.monthlyPriceMin <= 3000) averages.minRent["2001-3000"].counter++;
        if (filterCriteria.monthlyPriceMin > 3000 &&
            filterCriteria.monthlyPriceMin <= 4000) averages.minRent["3001-4000"].counter++;
        if (filterCriteria.monthlyPriceMin > 4000 &&
            filterCriteria.monthlyPriceMin <= 5000) averages.minRent["4001-5000"].counter++;
        // numBedrooms
        if (filterCriteria.numBedrooms === "Studio") averages.numBedrooms[0].counter++;
        if (filterCriteria.numBedrooms === 1) averages.numBedrooms[1].counter++;
        if (filterCriteria.numBedrooms === 2) averages.numBedrooms[2].counter++;
        if (filterCriteria.numBedrooms === 3) averages.numBedrooms[3].counter++;
        if (filterCriteria.numBedrooms === 4) averages.numBedrooms[4].counter++;
        // // rating
        // if (filterCriteria.rating === 1) averages.rating[1].counter++;
        // if (filterCriteria.rating === 2) averages.rating[2].counter++;
        // if (filterCriteria.rating === 3) averages.rating[3].counter++;
        // if (filterCriteria.rating === 4) averages.rating[4].counter++;
        // if (filterCriteria.rating === 5) averages.rating[5].counter++;
        // term of lease
        if (filterCriteria.termOfLease === "1 month") averages.termOfLease["1 month"].counter++;
        if (filterCriteria.termOfLease === "3 months") averages.termOfLease["3 months"].counter++;
        if (filterCriteria.termOfLease === "6 months") averages.termOfLease["6 months"].counter++;
        if (filterCriteria.termOfLease === "1 year") averages.termOfLease["1 year"].counter++;
        if (filterCriteria.termOfLease === "2 year") averages.termOfLease["2 years"].counter++;

    }
    FilterFactory.recommendOnFilters = function(filterCriteria){

        console.log(Object.keys(averages).map(function(key){
            var roundedAverage = Math.round(getWeightedAverages(averages[key]))
            return {key:key, weightedAverage:roundedAverage}
        }))
    }

   var averages = {
        maxRent:{
            "0-1000": {val:1, counter:0},
            "1001-2000": {val:2, counter:0},
            "2001-3000": {val:3, counter:0},
            "3001-4000": {val:4, counter:0},
            "4001-5000": {val:5, counter:0}
        },
        numBedrooms: {
            0: {val:1, counter:0},
            1: {val:2, counter:0},
            2: {val:3, counter:0},
            3: {val:4, counter:0},
            4: {val:5, counter:0}
        },
        rating: {
            1: {val:1, counter:0},
            2: {val:2, counter:0},
            3: {val:3, counter:0},
            4: {val:4, counter:0},
            5: {val:5, counter:0}
        },
        termOfLease:{
            "1 month": {val:1, counter:0},
            "3 months": {val:2, counter:0},
            "6 months": {val:3, counter:0},
            "1 year": {val:4, counter:0},
            "2 years": {val:5, counter:0}
        },
        minRent: {
            "0-1000": {val:1, counter:0},
            "1001-2000": {val:2, counter:0},
            "2001-3000": {val:3, counter:0},
            "3001-4000": {val:4, counter:0},
            "4001-5000": {val:5, counter:0}
        }
    }

    function getWeightedAverages(property){
        var keys = Object.keys(property);
        var total = 0;
        var counterSum = 0;
        keys.forEach(function(key){
            total += property[key].val*property[key].counter;
            counterSum += property[key].counter;
        })
        if (counterSum === 0) return null;
        return total/counterSum;
    }

    // BOBBY NOTE: We don't need this if we do the filtering on the front-end

    // AJAX request to find apartments based on user's filters
    // FilterFactory.filterResults = function(filterCriteria) {
    //     return $http.post("/api/apartments/filter", filterCriteria)
    //         .then(response => response.data)
    //         .then(null, console.error);
    // }

    return FilterFactory;
});
