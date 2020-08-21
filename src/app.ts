import DataExtractorService from "@services/dataExtractor.service";
import ValidationService from "@services/validation.service";
import Config from "@utils/Config";
import * as $ from "jquery";

export default class App {
    private $errorMessage;
    private $errorGroup;

    private $dotTarget;

    private $yValueGroup;
    private $yValueLabel;

    private currentRValue: number;
    private currentYValue: number;
    private currentXValue: number;

    constructor(
        private config: Config,
        private dataExtractorService: DataExtractorService,
        private validationService: ValidationService
    ) {
        this.$errorMessage = $('#error-text')
        this.$errorGroup = $('.error-group')
        this.$dotTarget = $('#target-dot')
        this.$yValueGroup = $('.y-value-group')
        this.$yValueLabel = $('.y-value-label')
    }

    initializeEventHandlers(): void {
        $("#submit-button").on('click', ( event ) => {
            event.preventDefault();
            this.clearErrorMessage();

            const { x, y, r } = this.dataExtractorService.getFormData();

            const possibleErrorsArray = this.validationService.isInputValid(x, y, r);
            if (possibleErrorsArray.length !== 0) {
                this.setErrorMessages(possibleErrorsArray)
                return
            }

            fetch(`${ this.config.get('SERVER_PATH') }server.php`, {
                method: 'POST',
                body: this.formRequest(x, y, r)
            })
                .then(response => response.text())
                .then(data => {
                        console.log(data);
                        $('.table-section').html(data);
                    }
                )
        });

        $('#reset-button').on('click', ( event ) => {
            event.preventDefault();
            this.clearErrorMessage();

            $('#y-value').val("");
            $('.y-value-label').removeClass('active-input');
            $('input[name="x-group"]:checked').prop('checked', false);
            $('input[name="r-group"]:checked').prop('checked', false);

            this.$dotTarget.attr("r", 0);
            this.currentYValue = null;
            this.currentRValue = null;
            this.currentXValue = null;
        });

        this.$yValueGroup.on('focusin', () =>
            this.$yValueLabel.addClass('active-input')
        );

        this.$yValueGroup.on('focusout', () => {
            if (!$('#y-value').val()) {
                this.$yValueLabel.removeClass('active-input')
            }
        })
    }

    private formRequest( x: number,
                         y: string,
                         r: number ): FormData {
        const formData = new FormData();
        formData.append('xValue', x.toString());
        formData.append('yValue', y);
        formData.append('rValue', r.toString());

        return formData;
    }

    private clearErrorMessage() {
        this.setErrorMessage();
        this.setErrorMessages();
    }

    private setErrorMessage( message: string = '' ) {
        this.$errorMessage.text(message)
    }

    private setErrorMessages( messages: Array<string> = [] ) {
        if (messages.length === 0) {
            this.$errorGroup.html($('<label id="error-text"></label>'))
            return
        }

        messages.forEach(
            value => this.$errorGroup.append($('<label></label>').text(value))
        );
    }
}
