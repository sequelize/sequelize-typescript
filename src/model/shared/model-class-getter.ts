import { ModelType, ModelObject } from '../model/model';

export type ModelClassGetter<TCreationAttributes, TModelAttributes> = (
  modelObject: ModelObject,
  returns?: void
) => ModelType<TCreationAttributes, TModelAttributes>;
