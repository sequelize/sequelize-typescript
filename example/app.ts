import {Sequelize} from "../src";

/* tslint:disable:no-unused-new */

new Sequelize({
  database: 'blog',
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  models: [
    __dirname + '/models'
  ]
});

new Sequelize({
  validateOnly: true,
  models: [__dirname + '/models/validation-only']
});
