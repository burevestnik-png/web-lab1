import '@styles/main_style';
import DataExtractorService from "@services/data-extractor.service";
import GraphicsService from "@services/graphics.service";
import ValidationService from "@services/validation.service";
import App from "./app";
import Config from '@utils/config';

const config = new Config();
config.set('SERVER_PATH', 'server/');

new App(
    config,
    new DataExtractorService(),
    new ValidationService(),
    new GraphicsService()
).initializeEventHandlers();
