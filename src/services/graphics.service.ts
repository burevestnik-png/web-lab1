import * as $ from "jquery";

export default class GraphicsService {
    private $dotTarget;

    constructor() {
        this.$dotTarget = $('#target-dot');
    }

    changeDotRadius( radius: number ) {
        this.$dotTarget.attr('r', radius);
    }

    changeDotPosition( x: number,
                       y: number,
                       r: number,
                       radius: number = 3) {
        const relativeUnit = 100 / r;

        this.changeDotRadius(radius);
        this.$dotTarget.attr("cy", 150 - relativeUnit * y);
        this.$dotTarget.attr("cx", 150 + relativeUnit * x);
    }
}
