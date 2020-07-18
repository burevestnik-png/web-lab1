<?php

function validateReceivedData($xValue, $yValue, $rValue)
{
    if (!is_double($rValue) || !is_double($yValue) || !is_int($xValue)) {
        return false;
    }

    if (!in_array($xValue, array(-4, -3, -2, -1, 0, 1, 2, 3, 4)) ||
        !in_array($rValue, array(1, 2, 3, 4, 5)) ||
        ($yValue < -3 || $yValue > 3)) {
        return false;
    }

    return true;
}

function checkHit($xValue, $yValue, $rValue)
{
    if (($xValue >= - $rValue / 2 && $xValue <= 0) && ($yValue >= 0 && $yValue <= $rValue)) {
        return "<span style='color: green'>True</span>";
    }

    if (($xValue >= 0 && $xValue <= $rValue) && ($yValue >= 0 && $yValue <= ($rValue - $xValue))) {
        return "<span style='color: green'>True</span>";
    }

    if ($xValue <= 0 && $yValue <= 0 && sqrt($xValue ** 2 + $yValue ** 2) < $rValue / 2) {
        return "<span style='color: green'>True</span>";
    }

    return "<span style='color: red'>False</span>";
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

echo "<div class=\"table\">
            <div class=\"table-header\">
                <span>X</span>
                <span>Y</span>
                <span>R</span>
                <span>Current time</span>
                <span>Execution time</span>
                <span>Hit result</span>
            </div>
            <div class=\"table-content\">";

foreach ($_SESSION['dataHistory'] as $value) {
    echo "<div class=\"table-row\">
                    <span>$value[0]</span>
                    <span>$value[1]</span>
                    <span>$value[2]</span>
                    <span>$value[3]</span>
                    <span>$value[4]</span>
                    <span>$value[5]</span>
                </div>";
}

echo "</div>
        </div>";