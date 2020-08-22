import * as $ from "jquery";

export default class GraphicsService {
    private $dotTarget;
    private svgPoint;

    constructor() {
        this.$dotTarget = $('#target-dot');
        this.svgPoint = document.querySelector('svg').createSVGPoint();
    }

    changeDotRadius( radius: number ) {
        this.$dotTarget.attr('r', radius);
    }

    changeDotPosition( x: number,
                       y: number,
                       r: number,
                       isCalculated: boolean = false,
                       radius: number = 3 ) {
        const relativeUnit = 100 / r;

        this.changeDotRadius(radius);
        this.$dotTarget.attr("cy", isCalculated? y : 150 - relativeUnit * y);
        this.$dotTarget.attr("cx", isCalculated? x : 150 + relativeUnit * x);
    }

    getClickPoint( event: JQuery.ClickEvent ): DOMPoint {
        this.svgPoint.x = event.clientX;
        this.svgPoint.y = event.clientY;

        return this.svgPoint.matrixTransform(
            document.querySelector('svg')
                    .getScreenCTM()
                    .inverse()
        );
    }
}
