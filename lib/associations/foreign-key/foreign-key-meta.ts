import {ModelClassGetter} from '../../model';

export interface ForeignKeyMeta {

  relatedClassGetter: ModelClassGetter;
  foreignKey: string;
}
