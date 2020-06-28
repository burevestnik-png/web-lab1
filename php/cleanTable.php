<?php
session_start();

if (isset($_SESSION['dataHistory'])) {
    $_SESSION['dataHistory'] = array();
}

echo "<div class=\"table\">
            <div class=\"table-header\">
                <div class=\"header__item\"><a id=\"x-value-head\" class=\"filter__link\" href=\"#\">X</a></div>
                <div class=\"header__item\"><a id=\"y-value-head\" class=\"filter__link filter__link--number\" href=\"#\">Y</a></div>
                <div class=\"header__item\"><a id=\"r-value-head\" class=\"filter__link filter__link--number\" href=\"#\">R</a></div>
                <div class=\"header__item\"><a id=\"current-time-head\" class=\"filter__link filter__link--number\" href=\"#\">Current time</a></div>
                <div class=\"header__item\"><a id=\"execution-time-head\" class=\"filter__link filter__link--number\" href=\"#\">Execution time</a></div>
                <div class=\"header__item\"><a id=\"hit-result-head\" class=\"filter__link filter__link--number\" href=\"#\">Hit result</a></div>
            </div>
            <div class=\"table-content\">";

echo "</div>
        </div>";

