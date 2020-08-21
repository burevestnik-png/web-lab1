import ValidationService from "@services/validation.service";
import * as $ from "jquery";

export default class DataExtractorService {
    constructor(
        private validationService: ValidationService
    ) {
    }

    getX(): number {
        return Number($('input[name="x-group"]:checked').val());
    }

    getR(): number {
        return Number($('input[name="r-group"]:checked').val());
    }

    getY(): number {
        const $yValue = $('#y-value');
        const yValue = ($yValue.val() ? $yValue.val() : "mokString") as string;

        if (yValue.includes(',')) {
            yValue.replace(",", ".")
        }

        console.log('yValue', yValue);

        // return checkDouble(yValue);
        return 0;
    }
}
