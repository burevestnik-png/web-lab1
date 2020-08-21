import DataExtractorService from "@services/dataExtractor.service";
import ValidationService from "@services/validation.service";
import Config from "@utils/Config";
import * as $ from "jquery";

export default class App {
    private $errorMessage;
    private $errorGroup;

    constructor(
        private config: Config,
        private dataExtractorService: DataExtractorService,
        private validationService: ValidationService
    ) {
        this.$errorMessage = $('#error-text');
        this.$errorGroup = $('.error-group')
    }

    initializeEventHandlers(): void {
        $("#submit-button").on('click', ( event ) => {
            event.preventDefault();

            const x = this.dataExtractorService.getX();
            const y = this.dataExtractorService.getY();
            const r = this.dataExtractorService.getR();

            const possibleErrorsArray = this.validationService.isInputValid(x, y, r);
            if (possibleErrorsArray.length !== 0) {
                this.setErrorMessages(possibleErrorsArray)
            }
        });
    }

    private setErrorMessage( message: string = '' ) {
        this.$errorMessage.text(message)
    }

    private setErrorMessages( messages: Array<string> ) {
        messages.forEach(
            value => this.$errorGroup.append($('<label></label>').text(value))
        )
    }
}
