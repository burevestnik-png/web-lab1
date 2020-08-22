import * as $ from "jquery";
import { FormData } from "../interfaces";

export default class DataExtractorService {
    getFormData(): FormData {
        return <FormData> {
            x: this.getX(),
            y: this.getY(),
            r: this.getR()
        }
    }

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
