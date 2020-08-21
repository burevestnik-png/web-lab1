import DataExtractorService from "@services/dataExtractor.service";
import Config from "@utils/Config";
import * as $ from "jquery";

export default class App {
    constructor(
        private config: Config,
        private dataExtractorService: DataExtractorService
    ) { }

    initializeEventHandlers(): void {
        $("#submit-button").on('click',  () => {
            console.log('X', this.dataExtractorService.getX())
            console.log('Y', this.dataExtractorService.getY())
            console.log('R', this.dataExtractorService.getR())
        });
    }
}
