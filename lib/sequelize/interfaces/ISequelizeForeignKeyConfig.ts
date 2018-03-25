import {ModelClassGetter} from '../../model/types/ModelClassGetter';

export interface ISequelizeForeignKeyConfig {

  relatedClassGetter: ModelClassGetter;
  foreignKey: string;
}
