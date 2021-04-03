import { ModelClassGetter } from '../../model/shared/model-class-getter';

export interface ForeignKeyMeta<TCreationAttributes, TModelAttributes> {
  relatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>;
  foreignKey: string;
}
