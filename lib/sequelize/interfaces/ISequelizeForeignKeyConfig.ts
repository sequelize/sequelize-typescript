import {ModelClassGetter} from '../../model/shared/model-class-getter';

export interface ISequelizeForeignKeyConfig {

  relatedClassGetter: ModelClassGetter;
  foreignKey: string;
}
