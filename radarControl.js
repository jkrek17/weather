

var map = L.map('map').setView([40, -95], 5);

L.mapboxGL({
    accessToken: 'pk.eyJ1IjoiamtyZWsxNyIsImEiOiJjaW8xNDBvcDMxYTZjdHRtM3FwMXVuc244In0.aPQDlTL5GY_0BOe9TDTM8Q',
    style: 'mapbox://styles/jkrek17/cld15kb09000o01sh6bi91glg'
}).addTo(map);

var Rlayer = new L.LayerGroup();

var timeArray = [];
var displayTime = [];
var currentTime = new Date();

for (var i = 10; i > 0; i--) {
    var date = new Date(currentTime - (i * 300000) - (3600 * 1000));
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var time = year + month + day + hours + minutes;
    var time_string = month + "/" + day + "/" + year + " " + hours + ":" + minutes;
    timeArray.push(time);
    displayTime.push(time_string);
}
console.log(timeArray);


var radarLayers = [];
for (var hour = 0; hour < 10; hour++) {
    time = timeArray[hour];
    //time = time.replace(":", "");
    console.log(time);
    address = "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/ridge::USCOMP-N0Q-" + time + "/{z}/{x}/{y}.png"
    console.log(address);

    radarLayers[hour] = L.tileLayer(address, {});
    radarLayers[hour].addTo(Rlayer);
}
Rlayer.addTo(map);

var start = 0;
var opacity = 0.5;
var end = Object.keys(timeArray).length;
var x = 0;

function changeImage() {
    radarLayers.map(function(layer) {
        layer.setOpacity(0)
    });
    radarLayers[x].setOpacity(opacity);
    currentTime = timeArray[x];
    displayT = displayTime[x];
    //var formattedDate = date.toLocaleString();
    //console.log(date);

    document.getElementById("layerTime").innerHTML = "Radar Time: " + displayT;
    //console.log(x);
    //info.update(x);
    //console.log("X is : " + x + " time is : " + jArray[x]);
    x++;

    if (x > (end - 1)) {
        x = 0;
    }
}

function play() {
    start = setInterval("changeImage()", 500);
}

function pause() {
    clearInterval(start);
}

function forward(y) {
    if ((x + y) > (end)) {
        x = 0;
    }

    radarLayers.map(function(layer) {
        layer.setOpacity(0)
    });
    radarLayers[x].setOpacity(opacity);
    //info.update(x);
    //console.log("X is : " + x + " time is : " + jArray[x]);
    x++;
}

function backward(y) {
    if ((x - y) < 0) {
        x = (11);
    }
    x--;
    console.log(x - y);
    radarLayers.map(function(layer) {
        layer.setOpacity(0)
    });
    radarLayers[(x - y)].setOpacity(opacity);
    //info.update((x - y));
    //console.log("X is : " + (x-y) + " time is : " + jArray[(x-y)]);
}

//############################################################################################################

var RadarControl = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.innerHTML = '<table border="0" align="center" width="400">' +
            '<tr>' +
            '<td align="center">' +
            '<h3>Radar Control</h3>' +
            '</td>' +
            '<td align="center">' +
            '<input type="button" value="-5 Minutes" onclick="backward(1)"></input>' +
            '</td>' +
            '<td align="center">' +
            '<input type="button" value="Play" onclick="play()"></input>' +
            '</td>' +
            '<td align="center">' +
            '<input type="button" value="Pause" onclick="pause()"></input>' +
            '</td>' +
            '<td align="center">' +
            '<input type="button" value="+ 5 Minutes" onclick="forward(1)"></input>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="center" colspan="5">' +
            '<p id="layerTime">Current Layer Time: </p>' +
            '</td>' +
            '</tr>' +
            '</table>';
        return container;
    }
});

var radarControl = new RadarControl(map);
map.addControl(radarControl);

