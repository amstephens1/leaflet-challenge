var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
  });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    }).addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(link, function(data) {
    function styleInfo(features) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: chooseColor(features.geometry.coordinates[2]),
        color: "#000000",
        radius: setRadius(features.properties.mag),
        stroke: true,
        weight: 0.5,
        
      };
    }
    

    function setRadius(magnitude) {
        switch (true) {
        case magnitude > 5:
            return 10;
        case magnitude > 4:
            return 8;
        case magnitude > 3:
            return 6;
        case magnitude > 2:
            return 4;
        case magnitude > 1:
            return 2;
        default:
            return .5;
        }
    }
    function chooseColor(coordinates) {
        switch (true) {
            case coordinates > 90:
                return "#FF0000";
            case coordinates > 70:
                return "#ff6600";
            case coordinates > 50:
                return "#FFFF00";
            case coordinates > 30:
                return "#99ff00";
            case coordinates > 10:
                return "#33ff00";
            default:
                return "#00FF00";
            }
        }


        L.geoJson(data, {
 
            pointToLayer: function(features, latlng) {
                return L.circleMarker(latlng);
        },
   
        style: styleInfo,
    
        onEachFeature: function(features, layer) {
            layer.bindPopup("Magnitude: " + features.properties.mag + "<br>Location: " + features.properties.place);
        }
        }).addTo(myMap); 
 
    
    var legend = L.control({
        position: "bottomright"
      });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var grades = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
        var colors = [
            "#00FF00",
            "#33ff00",
            "#99ff00",
            "#FFFF00",
            "#ff6600",
            "#FF0000"
        ];

       
        for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " + grades[i] + "<br>"
        }
        return div;
    };

   
    legend.addTo(myMap);

});