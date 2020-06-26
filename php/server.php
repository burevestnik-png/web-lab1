<?php
$yValue = $_POST["yValue"];
$xValue = $_POST["xValue"];
$rValue = $_POST["rValue"];

$received_data = $yValue . ", " . $xValue . ", " . $rValue;
echo $received_data;