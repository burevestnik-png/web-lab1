<?php

require_once 'validation.php';

date_default_timezone_set('Europe/Moscow');

session_start();

$startScriptTime = microtime(true);
$currentTime = date("H:i:s");

$x = (double) $_POST["x"];
$y = (double) $_POST["y"];
$r = (double) $_POST["r"];

if (!isValid($x, $y, $r)) {
    http_response_code(400);
    echo "Bad data";
    return;
}

$hitResult = isHit($x, $y, $r) ?
    "<span style='color: green'>True</span>" :
    "<span style='color: red'>False</span>";

$scriptExecutionTime = number_format(microtime(true) - $startScriptTime, 10, ".", "") * 1000000;

$receivedData = array(
                    $x,
                    $y,
                    $r,
                    $currentTime,
                    $scriptExecutionTime,
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