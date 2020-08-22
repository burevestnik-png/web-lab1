<?php
session_start();

if (isset($_SESSION['dataHistory'])) {
    $_SESSION['dataHistory'] = array();
}

echo "<div class=\"table\">
            <div class=\"table-header\">
                <span>X</span>
                <span>Y</span>
                <span>R</span>
                <span>Current time</span>
                <span>Execution time</span>
                <span>Hit result</span>
            </div>
            <div class=\"table-content\">
            
            </div>
        </div>";

