app.factory('FilterFactory', function() {

    var FilterFactory = {};
        // Function to check all filter criteria
    FilterFactory.checkAllCriteria = function(filterCriteria, apartmentToCheck) {

        // Helper functions to check each criteria
        var checkBedrooms = function() {
            if (!filterCriteria.numBedrooms) return true;
            if (filterCriteria.numBedrooms.val === apartmentToCheck.numBedrooms) return true;
            return false;
        };

        var checkRent = function() {
            var minRent = filterCriteria.monthlyPriceMin ? filterCriteria.monthlyPriceMin : 0;
            var maxRent = filterCriteria.monthlyPriceMax ? filterCriteria.monthlyPriceMax : 1000000000;

            if (apartmentToCheck.monthlyPrice >= minRent && apartmentToCheck.monthlyPrice <= maxRent) return true;
            return false;
        };

        var checkTerm = function() {
            if (!filterCriteria.termOfLease) return true;
            if (filterCriteria.termOfLease === apartmentToCheck.termOfLease) return true;
            return false;
        };

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
    };

    FilterFactory.recommendApartments = function(apartments, user, favorites){
        var FilterFactory = this;
        if(!favorites) favorites = [];
        console.log(favorites)
        if (favorites.length < 1){
            return FilterFactory.recommendOnFilters(apartments); //or user has no favorites
        }
        if (favorites){
            favorites.forEach(function(fav){
                var criteria ={}
                criteria.monthlyPriceMax  = fav.apartment.monthlyPrice + 500;
                criteria.monthlyPriceMin = fav.apartment.monthlyPrice - 500;
                criteria.numBedrooms = fav.apartment.numBedrooms;
                // criteria.rating = fav.apartment.rating;
                criteria.termOfLease = fav.apartment.termOfLease;
                // console.log(criteria)
                FilterFactory.updateAverages(criteria);
                // console.log(averages)
            })
            return FilterFactory.recommendOnFilters(apartments)
        }
    };

    FilterFactory.totalFilters = 0;
    FilterFactory.updateAverages = function(filterCriteria){
        // max rent
        if (filterCriteria.monthlyPriceMax > 0 &&
            filterCriteria.monthlyPriceMax <= 1000) averages.monthlyPriceMax["0-1000"].counter++;
        if (filterCriteria.monthlyPriceMax > 1000 &&
            filterCriteria.monthlyPriceMax <= 2000) averages.monthlyPriceMax["1001-2000"].counter++;
        if (filterCriteria.monthlyPriceMax > 2000 &&
            filterCriteria.monthlyPriceMax <= 3000) averages.monthlyPriceMax["2001-3000"].counter++;
        if (filterCriteria.monthlyPriceMax > 3000 &&
            filterCriteria.monthlyPriceMax <= 4000) averages.monthlyPriceMax["3001-4000"].counter++;
        if (filterCriteria.monthlyPriceMax > 4000 &&
            filterCriteria.monthlyPriceMax <= 5000) averages.monthlyPriceMax["4001-5000"].counter++;
        // min rent
        if (filterCriteria.monthlyPriceMin > 0 &&
            filterCriteria.monthlyPriceMin <= 1000) averages.monthlyPriceMin["0-1000"].counter++;
        if (filterCriteria.monthlyPriceMin > 1000 &&
            filterCriteria.monthlyPriceMin <= 2000) averages.monthlyPriceMin["1001-2000"].counter++;
        if (filterCriteria.monthlyPriceMin > 2000 &&
            filterCriteria.monthlyPriceMin <= 3000) averages.monthlyPriceMin["2001-3000"].counter++;
        if (filterCriteria.monthlyPriceMin > 3000 &&
            filterCriteria.monthlyPriceMin <= 4000) averages.monthlyPriceMin["3001-4000"].counter++;
        if (filterCriteria.monthlyPriceMin > 4000 &&
            filterCriteria.monthlyPriceMin <= 5000) averages.monthlyPriceMin["4001-5000"].counter++;
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

    };

    var rentKeys ={
        monthlyPriceMax: {
            1: 1000,
            2: 2000,
            3: 3000,
            4: 4000,
            5: 5000
        }, numBedrooms: {
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4
        }, rating: {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5
        }, termOfLease: {
            1: '1 month',
            2: '3 months',
            3: '6 months',
            4: '1 year',
            5: '2 years'
        }, monthlyPriceMin: {
            1: 0,
            2: 1000,
            3: 2000,
            4: 3000,
            5: 4000
        }

    };
    FilterFactory.recommendOnFilters = function(apartments){
        var newFilterCriteria = {};
        var rawCriteriaValues = Object.keys(averages).map(function(key){
            var roundedAverage = Math.round(getWeightedAverages(averages[key]));
            console.log("averages: ", roundedAverage);
            return {key:key, weightedAverage:roundedAverage};
        });

        var filtered = apartments;
        for(var i=0; i<rawCriteriaValues.length; i++){
            var currentValue = rawCriteriaValues[i];
                // first checks max rent
            newFilterCriteria[currentValue.key]=rentKeys[currentValue.key][currentValue.weightedAverage];
            var filterCheck = apartments.filter(function(apartment){
                return FilterFactory.checkAllCriteria(newFilterCriteria, apartment);
            })
            if (filterCheck.length < 1) newFilterCriteria[currentValue.key]=null;
            if (filterCheck.length <=3) return filterCheck;
            if (filterCheck.length > 3) filtered = filterCheck;

        }
        console.log(filtered);
        if (filtered.length <=3) return filtered;
        return filtered.sort(function(a,b){
            return b.rating - a.rating
        }).slice(0,3)
    };

   var averages = {
        monthlyPriceMax:{
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
        monthlyPriceMin: {
            "0-1000": {val:1, counter:0},
            "1001-2000": {val:2, counter:0},
            "2001-3000": {val:3, counter:0},
            "3001-4000": {val:4, counter:0},
            "4001-5000": {val:5, counter:0}
        }
    };

    function getWeightedAverages(property){
        var keys = Object.keys(property);
        var total = 0;
        var counterSum = 0;
        keys.forEach(function(key){
            total += property[key].val*property[key].counter;
            counterSum += property[key].counter;
        });
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
