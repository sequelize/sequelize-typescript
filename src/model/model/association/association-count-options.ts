import {Model} from '../model';
import {WhereOptions} from "sequelize";

export interface AssociationCountOptions<T extends Model<T>> {
  where: WhereOptions;
  scope: string | boolean;
}
