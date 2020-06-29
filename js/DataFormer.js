let activeXButton;
let errorLog;
let dotTarget;
let currentRValue;
let currentYValue;
let relativeUnit = 0;

let tableProperties = [
    "x-value-head",
    "y-value-head",
    "r-value-head",
    "current-time-head",
    "execution-time-head",
    "hit-result-head"
]

let NO_X_VALUE_SELECTED_TEXT = "You haven't selected x";
let FIELDS_Y_AND_R_MUST_BE_NUMBER = "The fields Y and R must be numbers";
let Y_VALUE_VALIDATE_ERROR = "Y value should be from -3 to 3";
let R_VALUE_VALIDATE_ERROR = "R value should be from 1 to 4";

function validateYValue(yValue) {
    console.log(`Validating: y = ${yValue}`);

    if (isNaN(Number(yValue))) {
        errorLog.text(FIELDS_Y_AND_R_MUST_BE_NUMBER);
        return false;
    }

    if (Number(yValue) < -3 || Number(yValue) > 3) {
        errorLog.text(Y_VALUE_VALIDATE_ERROR);
        return false;
    }

    return true;
}

function validateRValue(rValue) {
    console.log(`Validating: r = ${rValue}`);

    if (isNaN(Number(rValue))) {
        errorLog.text(FIELDS_Y_AND_R_MUST_BE_NUMBER);
        return false;
    }

    if (Number(rValue) < 1 || Number(rValue) > 4) {
        errorLog.text(R_VALUE_VALIDATE_ERROR);
        return false;
    }

    return true;
}

function getY() {
    let yValue = $('#y-value').val();

    if (yValue === "") {
        yValue = "emptyString";
    }

    return checkDouble(yValue);
}

function getR() {
    let rValue = $('#r-value').val();

    if (rValue === "") {
        rValue = "emptyString";
    }

    return checkDouble(rValue);
}

function checkDouble( value ) {
    if (value.toString().includes(",")) {
        return value.replace(",", ".");
    } else {
        return value;
    }
}

function calculateX(xValue) {
    return 150 + relativeUnit * xValue;
}

function calculateY(yValue) {
    return 150 - relativeUnit * yValue;
}

$(document).ready(function () {
    errorLog = $('#error-text');
    dotTarget = $('#target-dot');

    $(".x-button").on('click',function () {
        if (activeXButton === undefined ? undefined : activeXButton.attr("id") === $(this).attr("id")) {
            $(this).removeClass("active");
            activeXButton = undefined;
            return;
        }
        const xButtonList = $(".x-button");

        xButtonList.toArray().forEach(xButton => xButton.classList.remove("active"));
        $(this).addClass("active");

        activeXButton = $(this);

        if (currentRValue === undefined || currentYValue === undefined) {
            return;
        }

        relativeUnit = 100 / currentRValue;

        dotTarget.attr("r", 3);
        dotTarget.attr("cy", calculateY(currentYValue));
        dotTarget.attr("cx", calculateX(activeXButton.text()));
    });

    $('#r-value').change(function () {
        errorLog.text("");

        if (!validateRValue(getR())) {
            return;
        }

        currentRValue = getR();

        if (activeXButton === undefined || currentYValue === undefined) {
            return;
        }

        relativeUnit = 100 / currentRValue;

        dotTarget.attr("r", 3);
        dotTarget.attr("cy", calculateY(currentYValue));
        dotTarget.attr("cx", calculateX(activeXButton.text()));
    });

    $('#y-value').change(function () {
        errorLog.text("");

        if (!validateYValue(getY())) {
            return;
        }

        currentYValue = getY();

        if (activeXButton === undefined || currentRValue === 0) {
            return;
        }

        relativeUnit = 100 / currentRValue;

        dotTarget.attr("r", 3);
        dotTarget.attr("cy", calculateY(currentYValue));
        dotTarget.attr("cx", calculateX(activeXButton.text()));
    });

    $("#submit-button").on('click', function () {
        errorLog.text("");

        if (activeXButton === undefined) {
            errorLog.text(NO_X_VALUE_SELECTED_TEXT);
            return;
        }

        let xValue = activeXButton.text();
        let yValue = checkDouble(getY());
        let rValue = checkDouble(getR());

        console.log(`Got data: x = ${xValue}, y = ${yValue}, r = ${rValue}`);

        if (!validateRValue(rValue) || !validateYValue(yValue)) {
            return;
        }

        let request = new FormData();
        request.append('xValue', xValue);
        request.append('yValue', yValue);
        request.append('rValue', rValue);

        fetch('php/server.php', {
            method: 'POST',
            body: request
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                $('.table-section').html(data);
            });
    });

    $('#reset-button').on('click', () => {
        if (activeXButton !== undefined) {
            activeXButton.removeClass("active");
        }
        $('#r-value').val("");
        $('#y-value').val("");

        $('.r-value-label').removeClass('active-input');
        $('.y-value-label').removeClass('active-input');

        dotTarget.attr("r", 0);
    });

    $('.r-value-group').on('focusin', function () {
        $(this).find('.r-value-label').addClass('active-input');
    });


    $('.r-value-group').on('focusout', function () {
        if (!$('#r-value').val()) {
            $(this).find('.r-value-label').removeClass('active-input');
        }
    });

    $('.y-value-group').on('focusin', function () {
        $(this).find('.y-value-label').addClass('active-input');
    });


    $('.y-value-group').on('focusout', function () {
        if (!$('#y-value').val()) {
            $(this).find('.y-value-label').removeClass('active-input');
        }
    });

    $('#clean-table-button').click(function () {
        fetch('php/cleanTable.php', {
            method: 'POST'
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                $('.table-section').html(data);
            });
    });
});