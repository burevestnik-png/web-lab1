import * as $ from 'jquery';

let currentRValue;
let currentYValue;
let currentXValue;
let errorLog;
let relativeUnit = 0;

const FIELD_Y_MUST_BE_NUMBER = "The field Y must be number";
const Y_VALUE_VALIDATE_ERROR = "Y value should be from -3 to 3";
const X_MUST_BE_CHOSEN = "Value X must be chosen";
const R_MUST_BE_CHOSEN = "Value R must be chosen";

const Y_VALUE_GROUP_SELECTOR = ".y-value-group";

function calculateX(xValue) {
    return 150 + relativeUnit * xValue;
}

function calculateY(yValue) {
    return 150 - relativeUnit * yValue;
}

export const start = (config) => {
    errorLog = $('#error-text');
    const dotTarget = $('#target-dot');
    const content = $('.modal_info').detach();
    const svgPoint = document.querySelector('svg').createSVGPoint();

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

    $('input[type=radio][name="r-group"]').on('click',function () {
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

        let xValue = getX();
        let yValue = getY();
        let rValue = getR();

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

        fetch(`${config.get('SERVER_PATH')}server.php`, {
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

    $(Y_VALUE_GROUP_SELECTOR).on('focusin', function () {
        $(this).find('.y-value-label').addClass('active-input');
    });


    $(Y_VALUE_GROUP_SELECTOR).on('focusout', function () {
        if (!$('#y-value').val()) {
            $(this).find('.y-value-label').removeClass('active-input');
        }
    });

    $('#clean-table-button').on('click', function () {
        fetch(`${config.get('SERVER_PATH')}cleanTable.php`, {
            method: 'POST'
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                $('.table-section').html(data);
            });
    });

    const modalWindow = (function () {
        let closeButton = $('<button role="button" class="modal_close" title="Close"><span></span></button>');
        let $content = $('<div class="modal_content"/>');
        let modal = $('<div class="modal"/>');
        let $window = $(window);

        modal.append($content, closeButton);

        closeButton.on('click', function (event) {
            $('.modal') //, .modal_overlay
                .addClass('conceal')
                .removeClass('display');
            $('.open_button').removeClass('load');
            event.preventDefault();
            modalWindow.close();
        });

        return {
            center: function () {
                let top = Math.max($window.height() - modal.outerHeight(), 0) / 2;
                let left = Math.max($window.width() - modal.outerWidth(), 0) / 2;
                modal.css({
                    top: top + $window.scrollTop(),
                    left: left + $window.scrollLeft()
                })
            },
            open: function (settings) {
                $content.empty().append(settings.content);

                modal.css({
                    width: settings.width || 'auto',
                    height: settings.height || 'auto'
                }).appendTo('body');

                modalWindow.center();
                $(window).on('resize', modal.center);
            },
            close: function() {
                $content.empty();
                modal.detach();
                $(window).off('resize', modal.center);
            }
        };
    }());

    $('svg').on('click', function (event) {
        svgPoint.x = event.clientX;
        svgPoint.y = event.clientY;
        let cursorPoint = svgPoint.matrixTransform(document.querySelector('svg').getScreenCTM().inverse());
        console.log("(" + cursorPoint.x + ", " + cursorPoint.y + ")");

        currentRValue = getR();
        if (currentRValue === undefined) {
            showModalWindow("Oops", "It seems that you hadn't chosen R value");
            return;
        }

        relativeUnit = 100 / currentRValue;

        dotTarget.attr("r", 3);
        dotTarget.attr("cy", cursorPoint.y);
        dotTarget.attr("cx", cursorPoint.x);

        let y = (150 - cursorPoint.y) / relativeUnit;
        let x = (cursorPoint.x - 150) / relativeUnit;
        console.log(`${x} - x; ${y} - y`)

        let request = new FormData();
        request.append('xValue', x.toString());
        request.append('yValue', y.toString());
        request.append('rValue', currentRValue);

        fetch('php/server.php', {
            method: 'POST',
            body: request
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                $('.table-section').html(data);
            });
    })

    const showModalWindow = (h1String, pString) => {
        modalWindow.open({
            content: content,
            width: 540,
            height: 270
        })
        content.addClass('modal_content');
        $('.modal').addClass('display');
        $('.open_button').addClass('load');

        $('.modal_info').find("h1").html(h1String);
        $('.modal_info').find("p").html(pString);
    }
}
