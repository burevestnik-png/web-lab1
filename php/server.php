<?php
session_start();

$yValue = $_POST["yValue"];
$xValue = $_POST["xValue"];
$rValue = $_POST["rValue"];

$received_data = array($xValue, $yValue, $rValue);

if (!isset($_SESSION['dataHistory'])) {
    $_SESSION['dataHistory'] = array();
}

array_push($_SESSION['dataHistory'], $received_data);

echo "<table id=\"dataTable\"><tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
            </tr>";

foreach ($_SESSION['dataHistory'] as $value) {
    echo "<tr>
                <td>$value[0]</td>
                <td>$value[1]</td>
                <td>$value[2]</td>
         </tr>";
}

echo "</table>";