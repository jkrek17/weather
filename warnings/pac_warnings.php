<?php
echo '<style>';
echo '        table {';
echo '        font-family: arial, sans-serif;';
echo '        border-collapse: collapse;';
echo '        width: 100%;';
echo '    }';

echo '    td,';
echo '    th {';
echo '        border: 1px solid #dddddd;';
echo '        text-align: left;';
echo '        padding: 8px;';
echo '    }';

echo '    tr:nth-child(even) {';
echo '        background-color: #dddddd;';
echo '    }';
echo '</style>';

$url = 'https://ocean.weather.gov/shtml/NFDHSFEP1.php';
$data = file_get_contents($url);
$gale_count = preg_match_all('/GALE WARNING/i', $data, $matches);

$storm_count = preg_match_all('/STORM WARNING/i', $data, $matches);

$hf_count = preg_match_all('/HURRICANE FORCE WIND WARNING/i', $data, $matches);

$frzg_count = preg_match_all('/HEAVY FREEZING SPRAY WARNING/i', $data, $matches);

echo '<table>';
echo '    <tr>';
echo '        <th>High Seas Warning Type</th>';
echo '       <th> Pacific Count</th>';
echo '   </tr>';
echo '    <tr>';
echo '        <td><a href=' . $url . '>Hurricane Force Wind Warning</a></td>';
echo '        <td>' . $hf_count . '</td>';
echo '    </tr>';
echo '    <tr>';
echo '        <td><a href=' . $url . '>Storm Warning</a></td>';
echo '        <td>' . $storm_count . '</td>';
echo '    </tr>';
echo '    <tr>';
echo '        <td><a href=' . $url . '>Gale Warning</a></td></td>';
echo '        <td>' . $gale_count . '</td>';
echo '    </tr>';
echo '    <tr>';
echo '        <td><a href=' . $url . '>Heavy Freezing Spray Warning</a></td>';
echo '        <td>' . $frzg_count . '</td>';
echo '    </tr>';
echo '</table>';
