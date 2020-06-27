let activeXButton;
let errorLog;
let tableSelection;

let NO_X_VALUE_SELECTED_TEXT = "You haven't selected x";
let FIELDS_Y_AND_R_MUST_BE_NUMBER = "The fields Y and R must be numbers";
let Y_VALUE_VALIDATE_ERROR = "Y value should be from -3 to 3";
let R_VALUE_VALIDATE_ERROR = "R value should be from 1 to 4";

function validateUserInput( yValue, rValue ) {
    console.log(`Validating: x = ${yValue}, r = ${rValue}`);

    if (isNaN(Number(yValue)) || isNaN(Number(rValue))) {
        errorLog.text(FIELDS_Y_AND_R_MUST_BE_NUMBER);
        return false;
    }

    if (Number(yValue) < -3 || Number(yValue) > 3) {
        errorLog.text(Y_VALUE_VALIDATE_ERROR);
        return false;
    }

    if (Number(rValue) < 1 || Number(rValue) > 4) {
        errorLog.text(R_VALUE_VALIDATE_ERROR);
        return false;
    }

    return true;
}

function getY() {
    return $('#y-value').val() === "" ? "emptyString" : $('#y-value').val();
}

function getR() {
    return $('#r-value').val() === "" ? "emptyString" : $('#r-value').val();
}

$(document).ready(function () {
    errorLog = $('#error-text');

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
    });

    $("#submit-button").on('click', function () {
        if (activeXButton === undefined) {
            errorLog.text(NO_X_VALUE_SELECTED_TEXT);
            return;
        }

        let xValue = activeXButton.text();
        let yValue = getY();
        let rValue = getR();

        console.log(`Got data: x = ${xValue}, y = ${yValue}, r = ${rValue}`);

        if (!validateUserInput(yValue, rValue)) {
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
});