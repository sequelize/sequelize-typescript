import {Options} from 'sequelize';

export interface ISequelizeConfig extends Options {

  /**
   * Name of database
   */
  name: string;

  /**
   * Username of database
   */
  username: string;

  /**
   * Password for database user
   */
  password: string;

  /**
   * Path to models, which should be loaded
   */
  modelPaths?: string[];
}
