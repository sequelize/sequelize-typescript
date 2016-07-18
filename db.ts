import {SequelizeService} from "./orm/services/SequelizeService";

let sequelizeService = new SequelizeService();

sequelizeService.init({
  name: 'hb_dev',
  dialect: 'mysql',
  host: '127.0.0.1',
  username: 'root',
  password: ''
});

sequelizeService.register('./models');

export const db = sequelizeService;
