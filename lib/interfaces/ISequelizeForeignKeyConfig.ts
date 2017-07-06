import {AssociationForeignKeyOptions} from 'sequelize';
import {Model} from "../models/Model";

export interface ISequelizeForeignKeyConfig {

  relatedClassGetter: () => typeof Model;
  options: string | AssociationForeignKeyOptions;
}
