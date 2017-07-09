import {ModelClassGetter} from "../types/ModelClassGetter";

export interface ISequelizeForeignKeyConfig {

  relatedClassGetter: ModelClassGetter;
  foreignKey: string;
}
