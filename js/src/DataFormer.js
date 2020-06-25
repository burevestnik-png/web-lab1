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

/*
function validateUserInput( yValue, rValue, xValue ) {
    console.log(`Validating: x - ${yValue}, r - ${rValue}, x - ${xValue}`);
    console.log(typeof (testValue));
    return typeof(testValue) === "string";
}

submitButton.click(function () {

});*/

$(document).ready(function () {
    $(".x-button").on('click',function () {
        console.log(JSON.stringify(activeXButton));
        console.log(JSON.stringify($(this)));
        if (JSON.stringify(activeXButton) === JSON.stringify($(this))) {
            $(this).removeClass("active");
            activeXButton = undefined;
            return;
        }
        const xButtonList = $(".x-button");

        //hasClass
        xButtonList.toArray().forEach(xButton => xButton.classList.remove("active"));
        $(this).addClass("active");

        activeXButton = $(this);
    });

});