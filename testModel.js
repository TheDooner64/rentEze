require('./server/db')
var mongoose = require('mongoose');
var Neighborhood = mongoose.model('Neighborhood')
Neighborhood.findOrCreateByName("Midtown")
.then(function (found) {
    console.log(found)
})
