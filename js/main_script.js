let errorLog;
let dotTarget;
let currentRValue;
let currentYValue;
let currentXValue;
let relativeUnit = 0;

const FIELD_Y_MUST_BE_NUMBER = "The field Y must be number";
const Y_VALUE_VALIDATE_ERROR = "Y value should be from -3 to 3";
const X_MUST_BE_CHOSEN = "Value X must be chosen";
const R_MUST_BE_CHOSEN = "Value R must be chosen";

function validateYValue(yValue) {
    console.log(`Validating: y = ${yValue}`);

    if (isNaN(Number(yValue))) {
        errorLog.text(FIELD_Y_MUST_BE_NUMBER);
        return false;
    }

    if (Number(yValue) < -3 || Number(yValue) > 3) {
        errorLog.text(Y_VALUE_VALIDATE_ERROR);
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

    $("input[type=radio][name=\"x-group\"]").on('click',function () {
        errorLog.text("");

        currentXValue = $(this).val();

        if (currentRValue === undefined || currentYValue === undefined) {
            return;
        }

        relativeUnit = 100 / currentRValue;

        dotTarget.attr("r", 3);
        dotTarget.attr("cy", calculateY(currentYValue));
        dotTarget.attr("cx", calculateX($(this).val()));
    });

    $('input[type=radio][name="r-group"]').change(function () {
        errorLog.text("");

        currentRValue = $(this).val();

        if (currentXValue === undefined || currentYValue === undefined) {
            return;
        }

        relativeUnit = 100 / currentRValue;

        dotTarget.attr("r", 3);
        dotTarget.attr("cy", calculateY(currentYValue));
        dotTarget.attr("cx", calculateX(currentXValue));
    });

    $('#y-value').change(function () {
        errorLog.text("");

        if (!validateYValue(getY())) {
            dotTarget.attr("r", 0);
            return;
        }

        currentYValue = getY();

        if (currentRValue === undefined) {
            return;
        }

        relativeUnit = 100 / currentRValue;

        dotTarget.attr("r", 3);
        dotTarget.attr("cy", calculateY(currentYValue));
        dotTarget.attr("cx", calculateX(currentXValue));
    });

    $("#submit-button").on('click', function () {
        errorLog.text("");

        let xValue = $('input[name="x-group"]:checked').val();
        let yValue = checkDouble(getY());
        let rValue = $('input[name="r-group"]:checked').val();

        if (xValue === undefined) {
            errorLog.text(X_MUST_BE_CHOSEN);
            return;
        }

        if (rValue === undefined) {
            errorLog.text(R_MUST_BE_CHOSEN);
            return;
        }

        console.log(`Got data: x = ${xValue}, y = ${yValue}, r = ${rValue}`);

        if (!validateYValue(yValue)) {
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
        $('#y-value').val("");
        $('.y-value-label').removeClass('active-input');
        $('input[name="x-group"]:checked').prop('checked', false);
        $('input[name="r-group"]:checked').prop('checked', false);

        dotTarget.attr("r", 0);
        currentYValue = undefined;
        currentRValue = undefined;
        currentXValue = undefined;
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