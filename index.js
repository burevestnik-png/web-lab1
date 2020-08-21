import '@styles/main_style';
import '@services/validation.service'
import { start } from "./app";
import Config from "@utils/Config";

const config = new Config();
config.set('SERVER_PATH', 'server/');

start(config);
