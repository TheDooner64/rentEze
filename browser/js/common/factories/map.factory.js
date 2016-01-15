app.factory('MapFactory', function($http) {

    var MapFactory = {};

    MapFactory.findCenter = function(center) {
        center.replace(" ", "%20");
        return $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=new%20york%22&components=locality:" + center + "&key=AIzaSyDG1T1ZvOqHtAqgmkjjjHtXZz5HvwrW_w0")
            .then(function(res) {
                var hoodInfo = res.data;
                if (hoodInfo.results.length < 1) return {
                    lat: 40.705189,
                    lng: -74.009209
                }
                return hoodInfo.results[0].geometry.location;
            })
    }

    MapFactory.initialize_gmaps = function(center) {

        var styleArr = [{
            featureType: 'landscape',
            stylers: [{
                saturation: -100
            }, {
                lightness: 60
            }]
        }, {
            featureType: 'road.local',
            stylers: [{
                saturation: -100
            }, {
                lightness: 40
            }, {
                visibility: 'on'
            }]
        }, {
            featureType: 'transit',
            stylers: [{
                saturation: -100
            }, {
                visibility: 'simplified'
            }]
        }, {
            featureType: 'administrative.province',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'water',
            stylers: [{
                visibility: 'on'
            }, {
                lightness: 30
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#ef8c25'
            }, {
                lightness: 40
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#b6c54c'
            }, {
                lightness: 40
            }, {
                saturation: -40
            }]
        }];

        // initialize new google maps LatLng object
        var myLatlng = new google.maps.LatLng(center.lat, center.lng);

        // set the map options hash
        var mapOptions = {
            center: myLatlng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: styleArr
        };

        // get the maps div's HTML obj
        var map_canvas_obj = document.getElementById('map-canvas');

        // initialize a new Google Map with the options
        var map = new google.maps.Map(map_canvas_obj, mapOptions);

        return map;
    }

    // Function to  draw a location to the map
    MapFactory.drawLocation = function(map, location, opts) {
        if (typeof opts !== 'object') {
            opts = {};
        }
        opts.position = new google.maps.LatLng(location.latLong.lat, location.latLong.lng);
        opts.map = map;
        return new google.maps.Marker(opts);
    }

    return MapFactory;
});
