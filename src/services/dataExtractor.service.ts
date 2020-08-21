import ValidationService from "@services/validation.service";
import * as $ from "jquery";

export default class DataExtractorService {
    getX(): number {
        return Number($('input[name="x-group"]:checked').val());
    }

    getR(): number {
        return Number($('input[name="r-group"]:checked').val());
    }

    getY(): string {
        const $yValue = $('#y-value');
        let yValue = ($yValue.val() ? $yValue.val() : "mokString") as string;

        if (yValue.includes(',')) {
            yValue = yValue.replace(",", ".")
        }

        return yValue;
    }
}
