import '@styles/main_style';
import DataExtractorService from "@services/dataExtractor.service";
import ValidationService from "@services/validation.service";
import App from "./app";
import Config from '@utils/Config';

const config = new Config();
config.set('SERVER_PATH', 'server/');

new App(
    config,
    new DataExtractorService(),
    new ValidationService()
).initializeEventHandlers();
