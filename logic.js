// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.streets-basic",
accessToken: API_KEY
}).addTo(myMap);

// Our marker size function that will give each city a different radius based on its population
function markerSize(population) {
    return population / 40;
};

query_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(query_url, function(data) {
    // Once a response is received, send the data.features object to the createFeatures function
    console.log(data.features);
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Function that will determine the color of an earthquake based on its magnitude
    function chooseColor(mag) {
        if (mag <= 1) {
            return "green";
        }
        else if (mag > 1 && mag <= 2) {
            return "yellowgreen";
        }
        else if (mag > 2 && mag <= 3) {
            return "gold";
        }
        else if (mag > 3 && mag <= 4){
            return "darkorange";
        }
        else if (mag > 4 && mag <= 5){
            return "#de5300";
        }
        else if (mag > 5) {
            return "red";
        }
        else {
        return "green";
        }
    }
  


    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "black",
            weight: 1,
            fillColor: chooseColor(feature.properties.mag),
            radius: (feature.properties.mag * 20000)
            }).bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"
            + "<hr><p>Magnitude: " + feature.properties.mag + "</p>").addTo(myMap);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magniutdes = [0,1,2,3,4,5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magniutdes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(magniutdes[i] + 1) + '"></i> ' +
                magniutdes[i] + (magniutdes[i + 1] ? '&ndash;' + magniutdes[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
}

