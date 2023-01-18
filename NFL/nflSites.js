

$.getJSON("NFL/stadiums.geojson", function(data) {
    var geojson = L.geoJson(data);

    geojson.getLayers().forEach(function(layer) {
        //console.log(layer.feature.properties);
        lat = layer.feature.properties.Lat;
        lon = layer.feature.properties.Long;
        team = layer.feature.properties.Team;
        stadium = layer.feature.properties.Stadium;
        conference = layer.feature.properties.Conference;
        getWeather(lat,lon);
        
    });
});

var tempIcons = new L.LayerGroup();
var windIcons = new L.LayerGroup();
var precipIcons = new L.LayerGroup();

function dropDownChange() {

    let dropdownSelection = document.querySelector('select').value;
    console.log(dropdownSelection);

    if (map.hasLayer(tempIcons)) {
        map.removeLayer(tempIcons);
    }
    if (map.hasLayer(windIcons)) {
        map.removeLayer(windIcons);
    }
    if (map.hasLayer(precipIcons)) {
        map.removeLayer(precipIcons);
    }

    
    switch(true){

        case dropdownSelection == "Temp":
            map.addLayer(tempIcons);
            break;
        case dropdownSelection == "Wind":
            map.addLayer(windIcons);
            break;
        case dropdownSelection == "Rain/Snow":
            map.addLayer(precipIcons);
            break;
    }
}

//L.marker([lat,lon],{icon:createRainIcon("#6E3192", "black", "2")}).addTo(rain_markers)
var createIcon = function(fill, stroke, width){
return L.vectorIcon({
    className: 'my-circle-icon',
    svgHeight: 20,
    svgWidth: 20,
    type: 'circle',
    shape: {
    r: '7',
    cx: '10',
    cy: '10'
    },
    style: {
    fill: fill,
    stroke: stroke,
    strokeWidth: width
    }
})
};

function getWeather(lat,lon){
    apiKey = '9faa4df83ea2911cb8002f965ad3620d';
    apiCall = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
    fetch(apiCall)
        .then(response => response.json())
        .then(data => {


            feelsLike = parseInt(data.main.feels_like);
            //console.log(feelsLike);

            switch(true){

                case feelsLike >= 80:
                    L.marker([lat,lon],{icon:createIcon("orange", "black", "1")}).bindPopup("Feels Like: " + feelsLike).addTo(tempIcons);
                    break;
                case feelsLike < 80 && feelsLike > 40:
                    L.marker([lat,lon],{icon:createIcon("green", "black", "1")}).bindPopup("Feels Like: " + feelsLike).addTo(tempIcons);
                    break;
                case feelsLike <= 40 && feelsLike > 20:
                    L.marker([lat,lon],{icon:createIcon("blue", "black", "1")}).bindPopup("Feels Like: " + feelsLike).addTo(tempIcons);
                    break;
                case feelsLike <= 20:
                    L.marker([lat,lon],{icon:createIcon("lightblue", "black", "1")}).bindPopup("Feels Like: " + feelsLike).addTo(tempIcons);
                    break;
                default :
                    L.marker([lat,lon],{icon:createIcon("grey", "black", "1")}).bindPopup("Feels Like: " + feelsLike).addTo(tempIcons);
            }

            windSpeed = parseInt(data.wind.gust);
            //console.log(windSpeed);

            switch(true){

                case windSpeed > 30:
                    L.marker([lat,lon],{icon:createIcon("red", "black", "1")}).bindPopup("Wind Gusts: " + windSpeed).addTo(windIcons);
                    break;
                case windSpeed <= 30 && windSpeed > 20:
                    L.marker([lat,lon],{icon:createIcon("orange", "black", "1")}).bindPopup("Wind Gusts: " + windSpeed).addTo(windIcons);
                    break;
                case windSpeed <= 20 && windSpeed > 10:
                    L.marker([lat,lon],{icon:createIcon("yellow", "black", "1")}).bindPopup("Wind Gusts: " + windSpeed).addTo(windIcons);
                    break;
                case windSpeed <= 10:
                    L.marker([lat,lon],{icon:createIcon("green", "black", "1")}).bindPopup("Wind Gusts: " + windSpeed).addTo(windIcons);
                    break;
                default :
                    L.marker([lat,lon],{icon:createIcon("grey", "black", "1")}).bindPopup("Wind Gusts: " + windSpeed).addTo(windIcons);
            }


            weather = data.weather[0].main;
            console.log(weather);

            switch(weather){

                case "Rain":
                case "Thunderstorm":
                    L.marker([lat,lon],{icon:createIcon("red", "black", "1")}).bindPopup("Weather: " + weather).addTo(precipIcons);
                    break;
                case "Snow":
                    L.marker([lat,lon],{icon:createIcon("blue", "black", "1")}).bindPopup("Weather: " + weather).addTo(precipIcons);
                    break;
                case "Clear" :
                case "Clouds" :
                    L.marker([lat,lon],{icon:createIcon("green", "black", "1")}).bindPopup("Weather: " + weather).addTo(precipIcons);
                    break;
                default :
                    L.marker([lat,lon],{icon:createIcon("grey", "black", "1")}).bindPopup("Weather: " + weather).addTo(precipIcons);
            }

            map.addLayer(tempIcons);
            //console.log(data);
           // L.marker([lat,lon],{icon:createRainIcon("#6E3192", "black", "2")}).addTo(rain_markers)
        });
}

var nflControl = L.Control.extend({
    onAdd: function (map) {
        var select = L.DomUtil.create('select', 'my-control');
        select.innerHTML = '<option value="Temp">Temp</option><option value="Wind">Wind</option><option value="Rain/Snow">Rain/Snow</option>';
        select.onchange = function () {
            dropDownChange();
        };
        return select;
    }
});

var nflControl = new nflControl(map);
map.addControl(nflControl);


