import { ModelClassGetter } from '../../model/shared/model-class-getter';

export interface ForeignKeyMeta<TCreationAttributes extends {}, TModelAttributes extends {}> {
  relatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>;
  foreignKey: string;
}
