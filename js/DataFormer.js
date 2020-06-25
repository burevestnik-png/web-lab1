let activeXButton;

function submitFormAction() {
    /*let form = document.forms[0];
    console.log(form.elements[0])
    console.log(form.elements[1])

    let testValue = form.elements[0].value;
    console.log(testValue);

    let label = document.createElement('label');
    let main = document.querySelector('.user-input');

    if (validateUserInput(testValue)) {
        label.textContent = "yes";
    } else label.textContent = "false";

    main.appendChild(label);*/
}

function validateUserInput( yValue, rValue ) {
    console.log(`Validating: x - ${yValue}, r - ${rValue}`);

    try {
        Number(yValue);
        Number(rValue);
    } catch (e) {
        return false;
    }

    if (Number(yValue) < -3 || Number(yValue) > 3) {
        return false;
    }

    return !(Number(rValue) < 1 || Number(rValue) > 4);
}

$(document).ready(function () {
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

    $(".submit-button").click(function () {
        console.log(validateUserInput($('#y-value').val(), $('#r-value').val()))
    });
});