<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Mapbox GL -->
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css' rel='stylesheet' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.js'></script>
    <script src="https://unpkg.com/mapbox-gl-leaflet/leaflet-mapbox-gl.js"></script>
    <script src="leaflet.wms.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js"></script>


    <style>
        /* center the container */
        .custom-control {
            background: lightgrey;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            border: 1px solid black;
            border-radius: 4px;
            width: 300px;
        }

        /* style the label above the slider */
        .custom-label {
            display: block;
            text-align: center;
            font-size: 1.2em;
            margin-bottom: 10px;
        }

        /* center the slider within its container */
        .slider-container {
            display: inline-block;
            justify-content: center;
            width: 80%;
            margin-bottom: 10px;
        }

        /* style the slider */
        .slider {
            width: 100%;
        }

        .label-wrapper {
            display: block;
            align-items: center;
        }

        .custom-div {
            width: 90%;
        }


        /* style the dropdown menu */
        .custom-select {
            width: 100%;
            margin-bottom: 10px;
            font-size: 16px;
            padding: 8px 12px;
            border: 1px solid black;
            border-radius: 4px;
            box-sizing: border-box;
        }

        /* style the button row */
        .button-row {
            display: flex;
            justify-content: center;
            width: 90%;
            margin-bottom: 10px;
        }

        /* style the buttons */
        .button {
            width: 80px;
            height: 30px;
            margin-right: 5px;
            background-color: #007bff;
            color: #fff;
            font-size: 14px;
            border: 1px black;
            border-radius: 4px;
        }

        .custom-control button:hover {
            background-color: #0069d9;
        }

        .custom-control button:active {
            background-color: #0062cc;
        }

        /* style the time display */
        .time-display {
            text-align: center;
            font-size: 1.2em;
            margin-top: 10px;
        }


        #map {
            position: relative;
        }


        #loading {
            position: fixed;
            z-index: 9999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    </style>

</head>

<body>
    <div id="loading"></div>
    <div id="map" style="height: 90vh; "></div>
    <script src="grids.js"></script>
</body>

</html>