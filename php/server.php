<?php

function validateReceivedData($xValue, $yValue, $rValue)
{
    if (!is_double($rValue) || !is_double($yValue) || !is_int($xValue)) {
        return false;
    }

    if (!in_array($xValue, array(-4, -3, -2, -1, 0, 1, 2, 3, 4)) ||
        ($yValue < -3 || $yValue > 3) || ($rValue < 1 || $rValue > 4)) {
        return false;
    }

    return true;
}

function checkHit($xValue, $yValue, $rValue)
{
    if ((($xValue >= 0 || $xValue <= $rValue) && ($yValue >= 0 || $yValue <= $rValue/2)) ||
        (($xValue <= 0 && $yValue >= 0) && (($xValue * $xValue + $yValue * $yValue) <= ($rValue * $rValue / 4))) ||
        (((0 - $xValue) * (- $rValue - 0) - (0 - 0) * (0 - $yValue)) >= 0) &&
        (((0 - $xValue) * (0 + $yValue) - (- $rValue/2 - 0) * (-$rValue - $yValue)) >= 0) &&
        (((- $rValue / 2 - $xValue) * (0 - 0) - (0 + $rValue / 2) * (0 - $yValue)) >= 0)) {
        return "<span style='color: green'>True</span>";
    } else {
        return "<span style='color: red'>False</span>";
    }
}

date_default_timezone_set('Europe/Moscow');

session_start();

$startScriptTime = microtime(true);

$yValue = (double) $_POST["yValue"];
$xValue = (int) $_POST["xValue"];
$rValue = (double) $_POST["rValue"];

if (!validateReceivedData($xValue, $yValue, $rValue)) {
    // bad request
    http_response_code(400);
    return;
}

$currentTime = date("H:i:s");
$hitResult = checkHit($xValue, $yValue, $rValue);
$scriptExecutionTime = microtime(true) - $startScriptTime;

$receivedData = array($xValue,
    $yValue,
    $rValue,
    $currentTime,
    number_format($scriptExecutionTime, 10, ".", "") * 1000000,
    $hitResult);

if (!isset($_SESSION['dataHistory'])) {
    $_SESSION['dataHistory'] = array();
}

array_push($_SESSION['dataHistory'], $receivedData);

echo "<table id=\"dataTable\">
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Current time</th>
                <th>Execution time</th>
                <th>Hit result</th>
            </tr>";

foreach ($_SESSION['dataHistory'] as $value) {
    echo "<tr>
                <td>$value[0]</td>
                <td>$value[1]</td>
                <td>$value[2]</td>
                <td>$value[3]</td>
                <td>$value[4]</td>
                <td>$value[5]</td>
         </tr>";
}

echo "</table>";