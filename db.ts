import {SequelizeService} from "./orm/services/SequelizeService";
import {config} from "./config";

let sequelizeService = new SequelizeService();

sequelizeService.init(config.database);
sequelizeService.register('./models');

export const db = sequelizeService;
