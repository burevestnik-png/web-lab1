import * as $ from 'jquery';

export const start = (config) => {
    const svgPoint = document.querySelector('svg').createSVGPoint();

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

}
