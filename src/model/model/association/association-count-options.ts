import {Model} from '../../index';
import {FilteredModelAttributes} from '../../shared/filtered-model-attributes';
import {WhereOptions} from "../build-count-create-find/where-options";

export interface AssociationCountOptions<T extends Model<T>> {
  where: WhereOptions<FilteredModelAttributes<T>>;
  scope: string | boolean;
}
