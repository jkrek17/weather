

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
echo '        padding: 4px;';
echo '    }';

echo '    tr:nth-child(even) {';
echo '        background-color: #dddddd;';
echo '    }';
echo '</style>';

$urls = ['https://ocean.weather.gov/shtml/NFDHSFEP1.php', 'https://ocean.weather.gov/shtml/NFDHSFAT1.php'];

echo '<table>';
echo '    <tr>';
echo '        <th>High Seas Warning Type</th>';
echo '        <th style="text-align:center;"><a href=' . $urls[1] . '>Atlantic Count</a></th>';
echo '        <th style="text-align:center;"><a href=' . $urls[0] . '>Pacific Count</a></th>';
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
        $tStorm_pacific = preg_match_all('/\.\.\.TROPICAL STORM WARNING\.\.\./', $data);
        $hf_pacific = preg_match_all('/\.\.\.HURRICANE FORCE WIND WARNING\.\.\./', $data);
        $hur_pacific = preg_match_all('/\.\.\.HURRICANE WARNING\.\.\./', $data);
        $frzg_pacific = preg_match_all('/HEAVY FREEZING SPRAY WARNING/', $data);
    } else {
        $gale_atlantic = preg_match_all('/GALE WARNING/', $data);
        $storm_atlantic = preg_match_all('/STORM WARNING/', $data);
        $tStorm_atlantic = preg_match_all('/\.\.\.TROPICAL STORM WARNING\.\.\./', $data);
        $hf_atlantic = preg_match_all('/\.\.\.HURRICANE FORCE WIND WARNING\.\.\./', $data);
        $hur_atlantic = preg_match_all('/\.\.\.HURRICANE WARNING\.\.\./', $data);
        $frzg_atlantic = preg_match_all('/HEAVY FREEZING SPRAY WARNING/', $data);
    }
}
echo '    <tr>';
echo '        <td>Hurricane Warning</td>';
echo '        <td style="text-align:center;">' . $hur_atlantic . '</td>';
echo '        <td style="text-align:center;">' . $hur_pacific . '</td>';
echo '    </tr>';
echo '    <tr>';
echo '        <td>Hurricane Force Wind Warning</td>';
echo '        <td style="text-align:center;">' . $hf_atlantic . '</td>';
echo '        <td style="text-align:center;">' . $hf_pacific . '</td>';
echo '    </tr>';
echo '    <tr>';
echo '        <td>Storm Warning</td>';
echo '        <td style="text-align:center;">' . $storm_atlantic . '</td>';
echo '        <td style="text-align:center;">' . $storm_pacific . '</td>';
echo '    </tr>';
echo '    <tr>';
echo '        <td>Tropical Storm Warning</td>';
echo '        <td style="text-align:center;">' . $tStorm_atlantic . '</td>';
echo '        <td style="text-align:center;">' . $tStorm_pacific . '</td>';
echo '    </tr>';
echo '    <tr>';
echo '        <td>Gale Warning</td>';
echo '        <td style="text-align:center;">' . $gale_atlantic . '</td>';
echo '        <td style="text-align:center;">' . $gale_pacific . '</td>';
echo '    </tr>';
echo '    <tr>';
echo '        <td>Heavy Freezing Spray Warning</td>';
echo '        <td style="text-align:center;">' . $frzg_atlantic . '</td>';
echo '        <td style="text-align:center;">' . $frzg_pacific . '</td>';
echo '    </tr>';
echo '</table>';
?>
