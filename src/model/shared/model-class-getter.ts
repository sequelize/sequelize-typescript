import { ModelType } from '../model/model';

export type ModelClassGetter<TCreationAttributes, TModelAttributes> = (
  returns?: void
) => ModelType<TCreationAttributes, TModelAttributes>;
