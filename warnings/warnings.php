

<?php
echo '<style>';
echo '        table {';
echo '        font-family: arial, sans-serif;';
echo '        border-collapse: collapse;';
echo '        width: 100%;';
echo '    }';

echo '    td,';
echo '    th {';
echo '        border: 2px solid black;';
echo '        text-align: center;';
echo '        padding: 4px;';
echo '    }';

echo '    th {';
echo '        width: 33.33%;';
echo '    }';

echo '    td {';
echo '        width: 33.33%;';
echo '    }';

echo '    tr:nth-child(even) {';
echo '        background-color: #BBC9DA;';
echo '    }';
echo '</style>';

$urls = array('https://ocean.weather.gov/shtml/NFDHSFEP1.php', 'https://ocean.weather.gov/shtml/NFDHSFAT1.php');

echo '<table>';
echo '    <tr>';
echo '        <th>High Seas Warning Type</th>';
echo '        <th><a href=' . $urls[1] . '>Active Atlantic Warnings</a></th>';
echo '        <th><a href=' . $urls[0] . '>Active Pacific Warnings</a></th>';
echo '    </tr>';

$gale_atlantic = 0;
$gale_pacific = 0;
$storm_atlantic = 0;
$storm_pacific = 0;
$tStorm_atlantic = 0;
$tStorm_pacific = 0;
$hf_atlantic = 0;
$hf_pacific = 0;
$hur_atlantic = 0;
$hur_pacific = 0;
$frzg_atlantic = 0;
$frzg_pacific = 0;

foreach ($urls as $url) {
    $data = file_get_contents($url);
    if (strpos($url, 'NFDHSFEP1.php') !== false) {
        $gale_pacific = preg_match_all('/GALE WARNING/', $data);
        $storm_pacific = preg_match_all('/STORM WARNING/', $data);
        $tStorm_pacific = preg_match_all('/TROPICAL STORM WARNING/', $data);
        $hf_pacific = preg_match_all('/HURRICANE FORCE WIND WARNING/', $data);
        $hur_pacific = preg_match_all('/HURRICANE WARNING/', $data);
        $frzg_pacific = preg_match_all('/HEAVY FREEZING SPRAY WARNING/', $data);
    } else {
        $gale_atlantic = preg_match_all('/GALE WARNING/', $data);
        $storm_atlantic = preg_match_all('/STORM WARNING/', $data);
        $tStorm_atlantic = preg_match_all('/TROPICAL STORM WARNING/', $data);
        $hf_atlantic = preg_match_all('/HURRICANE FORCE WIND WARNING/', $data);
        $hur_atlantic = preg_match_all('/HURRICANE WARNING/', $data);
        $frzg_atlantic = preg_match_all('/HEAVY FREEZING SPRAY WARNING/', $data);
    }
}
echo '<table>';
if ($hur_atlantic != 0 || $hur_pacific != 0) {
    echo '    <tr>';
    echo '        <td>Hurricane Warning</td>';
    echo '        <td >' . $hur_atlantic . '</td>';
    echo '        <td >' . $hur_pacific . '</td>';
    echo '    </tr>';
}
if ($hf_atlantic != 0 || $hf_pacific != 0) {
    echo '    <tr>';
    echo '        <td>Hurricane Force Wind Warning</td>';
    echo '        <td >' . $hf_atlantic . '</td>';
    echo '        <td >' . $hf_pacific . '</td>';
    echo '    </tr>';
}
if ($storm_atlantic != 0 || $storm_pacific != 0) {
    echo '    <tr>';
    echo '        <td>Storm Warning</td>';
    echo '        <td >' . $storm_atlantic . '</td>';
    echo '        <td >' . $storm_pacific . '</td>';
    echo '    </tr>';
}
if ($tStorm_atlantic != 0 || $tStorm_pacific != 0) {
    echo '    <tr>';
    echo '        <td>Tropical Storm Warning</td>';
    echo '        <td >' . $tStorm_atlantic . '</td>';
    echo '        <td >' . $tStorm_pacific . '</td>';
    echo '    </tr>';
}
if ($gale_atlantic != 0 || $gale_pacific != 0) {
    echo '    <tr>';
    echo '        <td>Gale Warning</td>';
    echo '        <td >' . $gale_atlantic . '</td>';
    echo '        <td >' . $gale_pacific . '</td>';
    echo '    </tr>';
}
if ($frzg_atlantic != 0 || $frzg_pacific != 0) {
    echo '    <tr>';
    echo '        <td>Heavy Freezing Spray Warning</td>';
    echo '        <td >' . $frzg_atlantic . '</td>';
    echo '        <td >' . $frzg_pacific . '</td>';
    echo '    </tr>';
}
echo '</table>';

?>
