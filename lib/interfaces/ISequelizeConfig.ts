import {Options} from 'sequelize';

export interface ISequelizeConfig extends Options {

  name: string;
  username: string;
  password: string;
  modelPaths?: string[];
}
