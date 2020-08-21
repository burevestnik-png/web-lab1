import { ErrorLogs } from "../enums";

export default class ValidationService {
    isInputValid(
        x: number,
        y: string,
        r: number
    ): string[] {
        const errorArray = new Array<string>();

        if (this.checkX(x)) {
            errorArray.push(this.checkX(x))
        }

        if (this.checkR(r)) {
            errorArray.push(this.checkR(r))
        }

        if (this.checkY(y)) {
            errorArray.push(this.checkY(y))
        }

        return errorArray;
    }

    private checkX( value: number ): string {
        return isNaN(value) ? ErrorLogs.X_MUST_BE_CHOSEN : ""
    }

    private checkR( value: number ): string {
        return isNaN(value) ? ErrorLogs.R_MUST_BE_CHOSEN : ""
    }

    private checkY( value: string ): string {
        if (!Number(value)) {
            return ErrorLogs.FIELD_Y_MUST_BE_NUMBER
        }

        if (Number(value) < -3 || Number(value) > 3) {
            return ErrorLogs.Y_VALUE_VALIDATE_ERROR
        }

        return "";
    }
}
