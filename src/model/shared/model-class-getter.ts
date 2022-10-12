import { ModelType } from '../model/model';

export type ModelClassGetter<TCreationAttributes extends {}, TModelAttributes extends {}> = (
  returns?: void
) => ModelType<TCreationAttributes, TModelAttributes>;
