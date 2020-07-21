(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "jquery"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const jquery_1 = require("jquery");
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
    function getX() {
        return jquery_1.default('input[name="x-group"]:checked').val();
    }
    function getR() {
        return jquery_1.default('input[name="r-group"]:checked').val();
    }
    function getY() {
        let yValue = jquery_1.default('#y-value').val();
        if (yValue === "") {
            yValue = "emptyString";
        }
        return checkDouble(yValue);
    }
    function checkDouble(value) {
        if (value.toString().includes(",")) {
            return value.replace(",", ".");
        }
        else {
            return value;
        }
    }
    function calculateX(xValue) {
        return 150 + relativeUnit * xValue;
    }
    function calculateY(yValue) {
        return 150 - relativeUnit * yValue;
    }
    jquery_1.default(document).ready(function () {
        errorLog = jquery_1.default('#error-text');
        dotTarget = jquery_1.default('#target-dot');
        jquery_1.default("input[type=radio][name=\"x-group\"]").on('click', function () {
            errorLog.text("");
            currentXValue = Number(jquery_1.default(this).val());
            if (currentRValue === undefined || currentYValue === undefined) {
                return;
            }
            relativeUnit = 100 / currentRValue;
            dotTarget.attr("r", 3);
            dotTarget.attr("cy", calculateY(currentYValue));
            dotTarget.attr("cx", calculateX(Number(jquery_1.default(this).val())));
        });
        jquery_1.default('input[type=radio][name="r-group"]').on('click', function () {
            errorLog.text("");
            currentRValue = Number(jquery_1.default(this).val());
            if (currentXValue === undefined || currentYValue === undefined) {
                return;
            }
            relativeUnit = 100 / currentRValue;
            dotTarget.attr("r", 3);
            dotTarget.attr("cy", calculateY(currentYValue));
            dotTarget.attr("cx", calculateX(currentXValue));
        });
        jquery_1.default('#y-value').change(function () {
            errorLog.text("");
            if (!validateYValue(getY())) {
                dotTarget.attr("r", 0);
                return;
            }
            currentYValue = Number(getY());
            if (currentRValue === undefined) {
                return;
            }
            relativeUnit = 100 / currentRValue;
            dotTarget.attr("r", 3);
            dotTarget.attr("cy", calculateY(currentYValue));
            dotTarget.attr("cx", calculateX(currentXValue));
        });
        jquery_1.default("#submit-button").on('click', function () {
            errorLog.text("");
            let xValue = getX();
            let yValue = checkDouble(getY());
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
            fetch('server', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                body: request
            })
                .then(response => response.text())
                .then(data => {
                console.log(data);
                jquery_1.default('.table-section').html(data);
            });
        });
        jquery_1.default('#reset-button').on('click', () => {
            jquery_1.default('#y-value').val("");
            jquery_1.default('.y-value-label').removeClass('active-input');
            jquery_1.default('input[name="x-group"]:checked').prop('checked', false);
            jquery_1.default('input[name="r-group"]:checked').prop('checked', false);
            dotTarget.attr("r", 0);
            currentYValue = undefined;
            currentRValue = undefined;
            currentXValue = undefined;
        });
        jquery_1.default('.y-value-group').on('focusin', function () {
            jquery_1.default(this).find('.y-value-label').addClass('active-input');
        });
        jquery_1.default('.y-value-group').on('focusout', function () {
            if (!jquery_1.default('#y-value').val()) {
                jquery_1.default(this).find('.y-value-label').removeClass('active-input');
            }
        });
        // todo not support
        jquery_1.default('#clean-table-button').click(function () {
            fetch('php/cleanTable.php', {
                method: 'POST'
            })
                .then(response => response.text())
                .then(data => {
                console.log(data);
                jquery_1.default('.table-section').html(data);
            });
        });
    });
});
//# sourceMappingURL=main_script.js.map