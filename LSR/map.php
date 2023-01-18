<html>

<head>
    <title>Leaflet Map and Table</title>

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin="" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/leaflet.js"></script>
    <style>
        #map {
            width: 900px;
            height: 700px;
        }
    </style>
</head>

<body>
    <?php
    if (isset($_GET['sts']) && isset($_GET['ets'])) {
        $start_string = $_GET['sts'];
        $end_string = $_GET['ets'];
    } else {
        $start_string = "20200217000000";
        $end_string = "20200217010000";
    }
    $url = "https://mesonet.agron.iastate.edu/geojson/lsr.php?sts=" . $start_string . "&ets=" . $end_string . "&wfos=&callback=gotData";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($output);

    $reports = [];

    foreach ($data->features as $feature) {
        $report = [];
        $report['city'] = $feature->properties->city;
        $report['type'] = $feature->properties->typetext;
        $report['mag'] = $feature->properties->magnitude;
        $report['valid'] = $feature->properties->valid;
        $report['location'] = [$feature->geometry->coordinates[1], $feature->geometry->coordinates[0]];
        $report['text'] = "<pre>" . $feature->properties->city . "\n" . $feature->properties->typetext . "\n" . $feature->properties->magnitude . "</pre>";
        array_push($reports, $report);
    }

    // sort the array by magnitude
    usort($reports, function ($a, $b) {
        return $b['mag'] <=> $a['mag'];
    });


    // Create Leaflet map
    $mapDiv = "<div id='map'></div>";
    $mapDiv .= '<script>let map = L.map(\'map\').setView([45, -100], 4); L.tileLayer(\'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\', { attribution: \'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors\' }).addTo(map);</script>';
    $tableDiv = "<div id='data-table'></div>";
    $table = "<table border='1'>";
    $table .= "<th>City, Event Type, Magnitude, Valid Time</th>";
    foreach ($reports as $report) {
        $table .= "<tr><td>" . $report['city'] . "</td><td>" . $report['type'] . "</td><td>" . $report['mag'] . "</td><td>" . $report['valid'] . "</td></tr>";
        $mapDiv .= '<script>L.marker(' . json_encode($report['location']) . ').bindPopup(' . json_encode($report['text']) . ').addTo(map);</script>';
    }
    $table .= "</table>";

    // Add form for start and end string inputs
    $form = "<form method='GET'> Start String: <input type='text' name='sts'><br>End String: <input type='text' name='ets'><br><input type='submit' value='Submit'></form>";

    echo $form . $mapDiv . $tableDiv . $table;
    ?>
</body>

</html>