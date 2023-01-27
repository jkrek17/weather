
var opts = {
    lines: 15, // The number of lines to draw
    length: 50, // The length of each line
    width: 10, // The line thickness
    radius: 50, // The radius of the inner circle
    color: 'blue', // The color of the lines
    speed: 1, // The rotation speed
    trail: 100, // Afterglow percentage
    shadow: true, // Enable the shadow option
    className: 'spinner', // The CSS class to assign to the spinner
  };
  var target = document.getElementById('loading');
  var spinner = new Spinner(opts)
 

let displayTime = [];
var ndfd = new L.LayerGroup();
var ndfd_points = new L.LayerGroup();
var currentIndex = 0;
let intervalId;
var refresh = 500;
var increment = 0;

var map = L.map('map').setView([40, -95], 4);
var oceanmap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 13
}).addTo(map);

map.on('contextmenu', function(e) {
    e.preventDefault();
});

map.on('preclick', function(e) {
    e.preventDefault();
});

$.getJSON("states.geojson", function(data) {
    var geojson = L.geoJson(data, {
        style: function(feature) {
            return {
                color: 'black',
                fillColor: 'grey',
                opacity: 0.5
            };
        }
    });
    geojson.addTo(map);

});

function getLayers() {
    var timeArray = [];
    var currentTime = new Date();

    // Get the current hour in UTC
    var currentHour = currentTime.getUTCHours();

    // Find the nearest multiple of 6
    var nearestMultiple = 6 - (currentHour % 6);

    // Add the nearest multiple to the current time to get the starting time in UTC
    var startTime = new Date(Date.UTC(currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours() + nearestMultiple, 0, 0));

    for (var i = 0; i < 12; i++) {
        var date = new Date(startTime.getTime() + (i * (6 * 3600 * 1000)));
        var year = date.getUTCFullYear();
        var month = (1 + date.getUTCMonth()).toString().padStart(2, '0');
        var day = date.getUTCDate().toString().padStart(2, '0');
        var hours = date.getUTCHours().toString().padStart(2, '0');
        var minutes = "00";
        var time = year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
        var time_string = month + "/" + day + "/" + year + " " + hours + ":" + minutes;
        timeArray.push(time);
        displayTime.push(time_string);
    }
    //console.log(timeArray);

    var wave_layers = [];
    var wave_layer_points = [];
    var wind_layers = [];
    var wind_layer_points = [];
    var wwa_layers = [];
    var wwa_layer_points = [];
    

    for (var i = 0; i < timeArray.length; i++) {
        var grid_time = timeArray[i];

        var ndfd_wind = L.WMS.overlay("https://digital.weather.gov/wms.php", {
            layers: "ndfd.oceanic.windspd",
            format: "image/png",
            transparent: "true",
            version: "1.3.0",
            vt: grid_time,
            opacity: 0.5
        });
        var ndfd_wind_points = L.WMS.overlay("https://digital.weather.gov/wms.php", {
            layers: "ndfd.oceanic.windspd.points",
            format: "image/png",
            transparent: "true",
            version: "1.3.0",
            vt: grid_time,
            opacity: 0.5
        });
        var ndfd_wave = L.WMS.overlay("https://digital.weather.gov/wms.php", {
            layers: "ndfd.oceanic.waveheight",
            format: "image/png",
            transparent: "true",
            version: "1.3.0",
            vt: grid_time,
            opacity: 0.5
        });
        var ndfd_wave_points = L.WMS.overlay("https://digital.weather.gov/wms.php", {
            layers: "ndfd.oceanic.waveheight.points",
            format: "image/png",
            transparent: "true",
            version: "1.3.0",
            vt: grid_time,
            opacity: 0.5
        });
        var ndfd_hazard = L.WMS.overlay("https://digital.weather.gov/wms.php", {
            layers: "ndfd.oceanic.wwa",
            format: "image/png",
            transparent: "true",
            version: "1.3.0",
            vt: grid_time,
            opacity: 0.5
        });
        var ndfd_wwa_points = L.WMS.overlay("https://digital.weather.gov/wms.php", {
            layers: "ndfd.oceanic.wwa.points",
            format: "image/png",
            transparent: "true",
            version: "1.3.0",
            vt: grid_time,
            opacity: 0.5
        });

        wind_layers.push(ndfd_wind);
        wind_layer_points.push(ndfd_wind_points);
        wave_layers.push(ndfd_wave);
        wave_layer_points.push(ndfd_wave_points)
        wwa_layers.push(ndfd_hazard);
        wwa_layer_points.push(ndfd_wwa_points);
    }
    //console.log(wind_layers);
    return [timeArray, wind_layers, wave_layers, wwa_layers, wind_layer_points, wave_layer_points, wwa_layer_points, displayTime];
}

function plotLayers(time, grid, points) {

    ndfd.clearLayers();
    ndfd_points.clearLayers();
    spinner.spin(document.getElementById("loading"));

    for (var i = 0; i < time.length; i++) {
        console.log(time[i]);
        grid[i].addTo(ndfd);
        points[i].addTo(ndfd_points);
        ndfd.addTo(map);
        ndfd_points.addTo(map);
    }
}

function changeImage() {

    var ndfdLayers = ndfd.getLayers();
    var pointsLayers = ndfd_points.getLayers();
    // Get time display element
    var timeDisplay = document.querySelector('.time-display');

    for (var i = 0; i < ndfdLayers.length; i++) {
        if (i === currentIndex) {
            ndfdLayers[i].setOpacity(0.8);
            pointsLayers[i].setOpacity(1);
            pointsLayers[i].bringToFront();
            // Update time display element
            timeDisplay.innerHTML = 'Time: ' + displayTime[currentIndex];
        } else {
            ndfdLayers[i].setOpacity(0);
            pointsLayers[i].setOpacity(0);
        }
    }

    if (currentIndex === ndfdLayers.length-1) {
        currentIndex = 0;
        spinner.stop();
    }
}

function play() {
    currentIndex = 0;
    clearInterval(intervalId);
    intervalId = setInterval(goForward, refresh);
}

function pause() {
    spinner.stop();
    clearInterval(intervalId);
}

function goBack(increment) {
    if (increment === undefined){increment = -1;}
    currentIndex += increment;
    changeImage();
    if (currentIndex < 0) {
        currentIndex = ndfd.getLayers().length - 1;
    }
}

function goForward(increment) {
    if (increment === undefined){increment = 1;}
    currentIndex += increment;
    changeImage();
    if (currentIndex >= ndfd.getLayers().length) {
        currentIndex = 0;
    }
}


function dropDownChange() {

    let dropdownSelection = document.querySelector('select').value;
    console.log(dropdownSelection);

    var result = getLayers();
    console.log(result);

    switch (true) {

        case dropdownSelection == "Waves":
            plotLayers(result[0], result[2], result[5]);
            break;
        case dropdownSelection == "Wind":
            plotLayers(result[0], result[1], result[4]);
            break;
        case dropdownSelection == "Hazards":
            plotLayers(result[0], result[3], result[6]);
            break;
    }
}

var gridControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'custom-control');

        L.DomEvent.disableClickPropagation(container);

        var dropRow = L.DomUtil.create('div', 'custom-div', container);
        var label = L.DomUtil.create('label', 'custom-label', dropRow);
        label.innerHTML = 'Grid Selection:';
        var select = L.DomUtil.create('select', 'custom-select', dropRow);
        select.innerHTML = '<option value="Waves">Waves</option>' +
            '<option value="Wind">Wind</option>' +
            '<option value="Hazards">Hazards</option>';
        select.onchange = function() {
            dropDownChange();
        };

        var buttonRow = L.DomUtil.create('div', 'button-row', container);
        var backButton = L.DomUtil.create('button', 'button', buttonRow);
        backButton.innerHTML = 'back';
        backButton.onclick = function() {
            pause();
            goBack(-1);
        };
        var pauseButton = L.DomUtil.create('button', 'button', buttonRow);
        pauseButton.innerHTML = 'pause';
        pauseButton.onclick = function() {
            pause();
        };
        var playButton = L.DomUtil.create('button', 'button', buttonRow);
        playButton.innerHTML = 'play';
        playButton.onclick = function() {
            intervalId = setInterval(goForward, refresh);
        };
        var forwardButton = L.DomUtil.create('button', 'button', buttonRow);
        forwardButton.innerHTML = 'forward';
        forwardButton.onclick = function() {
            pause();
            goForward(1);
        };

        var sliderContainer = L.DomUtil.create('div', 'slider-container', container);
        var wrapper = L.DomUtil.create('div','label-wrapper', sliderContainer)
        var speedLabel = L.DomUtil.create('label', 'custom-label', wrapper);
        speedLabel.innerHTML = 'Speed:';

        var speedInput = L.DomUtil.create('input', 'slider', sliderContainer);
        speedInput.type = 'range';
        speedInput.min = 1;
        speedInput.max = 10;
        speedInput.value = 5;
        speedInput.oninput = function() {
            // Set a minimum and maximum speed in miliseconds
            var minSpeed = 100; // 1 second
            var maxSpeed = 1000; // 0.1 seconds

            // Get the current slider value
            slider_value = this.value

            // Calculate the speed using the formula:
            // speed = maxSpeed + (minSpeed - maxSpeed) * (sliderValue / 10)
            refresh = maxSpeed + (minSpeed - maxSpeed) * (slider_value/10);
            console.log(refresh);
            play();
        };
        speedLabel.innerHTML = 'Speed: ' + (refresh/100);
        speedInput.addEventListener('input', function() {
            speedLabel.innerHTML = 'Speed: ' + this.value;
         });


        // Create time display element
        var timeContainer = L.DomUtil.create('div', 'time-container', container);
        var timeDisplay = L.DomUtil.create('p', 'time-display', timeContainer);
        timeDisplay.innerHTML = 'Time: ';

        return container;
    }
});
var gridControl = new gridControl(map);
map.addControl(gridControl);

// Functions to run on page load
dropDownChange();
play();

// Fire events and listeners  /////////////////////////////////////////////////////////////////////

document.addEventListener("keyup", function(event) {
    if (event.code === "ArrowLeft") {
        event.preventDefault();
        goBack();
    } else if (event.code === "ArrowRight") {
        event.preventDefault();
        goForward();
    } else if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
    } else if (event.code === "ArrowUp") {
        event.preventDefault();
        changeDropdownUp();
    } else if (event.code === "ArrowDown") {
        event.preventDefault();
        changeDropdownDown();
    }
});

function togglePlay() {
    if (intervalId) {
        pause();
    } else {
        play();
    }
}

function changeDropdownUp() {
    let select = document.querySelector('select');
    let options = select.options;
    let selectedIndex = select.selectedIndex;
    if (selectedIndex > 0) {
        select.selectedIndex = selectedIndex - 1;
        dropDownChange();
    }
}

function changeDropdownDown() {
    let select = document.querySelector('select');
    let options = select.options;
    let selectedIndex = select.selectedIndex;
    if (selectedIndex < options.length - 1) {
        select.selectedIndex = selectedIndex + 1;
        dropDownChange();
    }
}
// Fire events and listeners end /////////////////////////////////////////////////////////////////////

$(document).ready(function(){
    alert("Please be patient. Data will take a minute or two to load.");
});
