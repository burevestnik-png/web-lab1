import ModalWindowComponent from "@components/modal-window.component";
import DataExtractorService from '@services/data-extractor.service';
import GraphicsService from "@services/graphics.service";
import ValidationService from '@services/validation.service';
import Config from '@utils/config';
import * as $ from 'jquery';

export default class App {
    private $errorMessage;
    private $errorGroup;

    private $yValueGroup;
    private $yValueLabel;
    private $tableSection;

    private currentRValue: number;
    private currentYValue: number;
    private currentXValue: number;

    private modalWindow: ModalWindowComponent;

    constructor(
        private config: Config,
        private dataExtractorService: DataExtractorService,
        private validationService: ValidationService,
        private graphicsService: GraphicsService
    ) {
        this.$errorMessage = $('#error-text')
        this.$errorGroup = $('.error-group')
        this.$yValueGroup = $('.y-value-group')
        this.$yValueLabel = $('.y-value-label')
        this.$tableSection = $('.table-section')

        this.modalWindow = new ModalWindowComponent();

        if (localStorage.getItem('table-data')) {
            this.$tableSection.html(
                localStorage.getItem('table-data')
            )
        }
    }

    initializeEventHandlers(): void {
        $('#submit-button').on('click', ( event ) => {
            event.preventDefault();
            this.clearErrorMessage();

            const { x, y, r } = this.dataExtractorService.getFormData();

            const possibleErrorsArray = this.validationService.isInputValid(x, y, r);
            if (possibleErrorsArray.length !== 0) {
                this.setErrorMessages(possibleErrorsArray)
                return
            }

            fetch(`${ this.config.get('SERVER_PATH') }hit.php`, {
                method: 'POST',
                body: this.formRequest(x, y, r)
            })
                .then(response => response.text())
                .then(data => {
                        // console.log(data);
                        this.saveToLocalStorage(data);
                        this.$tableSection.html(data);
                    }
                )
        });

        $('#reset-button').on('click', ( event ) => {
            event.preventDefault();
            this.clearErrorMessage();

            $('#y-value').val('');
            $('.y-value-label').removeClass('active-input');
            $('input[name="x-group"]:checked').prop('checked', false);
            $('input[name="r-group"]:checked').prop('checked', false);

            this.graphicsService.changeDotRadius(0);
            this.currentYValue = undefined;
            this.currentRValue = undefined;
            this.currentXValue = undefined;
        });

        $('#clean-table-button').on('click', () => {
            fetch(`${ this.config.get('SERVER_PATH') }cleanTable.php`, {
                method: 'POST'
            })
                .then(response => response.text())
                .then(data => {
                    // console.log(data);
                    localStorage.clear();
                    this.$tableSection.html(data);
                });
        });

        this.$yValueGroup.on('focusin', () =>
            this.$yValueLabel.addClass('active-input')
        );

        this.$yValueGroup.on('focusout', () => {
            if (!$('#y-value').val()) {
                this.$yValueLabel.removeClass('active-input')
            }
        })

        $('input[type=radio][name="x-group"]').on('click', () => {
            this.clearErrorMessage();

            this.currentXValue = this.dataExtractorService.getX();
            if (this.currentRValue === undefined || this.currentYValue === undefined) return;

            this.graphicsService.changeDotPosition(this.currentXValue, this.currentYValue, this.currentRValue)
        })

        $('input[type=radio][name="r-group"]').on('click', () => {
            this.clearErrorMessage();

            this.currentRValue = this.dataExtractorService.getR();
            if (this.currentXValue === undefined || this.currentYValue === undefined) return;

            this.graphicsService.changeDotPosition(this.currentXValue, this.currentYValue, this.currentRValue)
        });

        $('#y-value').on('input', () => {
            this.clearErrorMessage();

            const y = this.dataExtractorService.getY();
            if (this.validationService.checkY(y) || this.currentRValue === undefined || this.currentXValue === undefined) {
                this.graphicsService.changeDotRadius(0);
                return
            }

            this.currentYValue = Number(y);
            this.graphicsService.changeDotPosition(this.currentXValue, this.currentYValue, this.currentRValue)
        });

        $('svg').on('click', ( event ) => {
            const clickPoint = this.graphicsService.getClickPoint(event);

            this.currentRValue = this.dataExtractorService.getR();
            if (isNaN(this.currentRValue)) {
                this.modalWindow.show("Oops", "It seems that you hadn't chosen R value");
                return
            }

            this.graphicsService.changeDotPosition(clickPoint.x, clickPoint.y, this.currentRValue, true)
            $('#y-value').val('');
            $('.y-value-label').removeClass('active-input');
            $('input[name="x-group"]:checked').prop('checked', false);

            fetch(`${ this.config.get('SERVER_PATH') }hit.php`, {
                method: 'POST',
                body: this.formRequestFromClick(clickPoint.x, clickPoint.y, this.currentRValue)
            })
                .then(response => response.text())
                .then(data => {
                    // console.log(data);
                    this.saveToLocalStorage(data);
                    this.$tableSection.html(data);
                });
        })
    }

    saveToLocalStorage( data: string ) {
        localStorage.setItem('table-data', data);
    }

    private formRequest( x: number,
                         y: string,
                         r: number ): FormData {
        const formData = new FormData();
        formData.append('x', x.toString());
        formData.append('y', y);
        formData.append('r', r.toString());

        return formData;
    }

    private formRequestFromClick( x: number,
                                  y: number,
                                  r: number ): FormData {
        const formData = new FormData();
        formData.append('x', ((x - 150) / (100 / this.currentRValue)).toFixed(1).toString());
        formData.append('y', ((150 - y) / (100 / this.currentRValue)).toFixed(1).toString());
        formData.append('r', r.toString());

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
