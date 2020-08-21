import { ErrorLogs } from "../enums";

export default class ValidationService {
    isYValid( value: string ): string {
        console.log(`Validating Y value: ${ value }`);

        if (!Number(value)) {
            return ErrorLogs.FIELD_Y_MUST_BE_NUMBER
        }

        if (Number(value) < -3 || Number(value) > 3) {
            return ErrorLogs.Y_VALUE_VALIDATE_ERROR
        }

        return "";
    }
}
