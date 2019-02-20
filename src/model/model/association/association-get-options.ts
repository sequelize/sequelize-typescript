import {Model} from '../model';
import {WhereOptions} from "sequelize";

export interface AssociationGetOptions<T extends Model<T>> {
  where: WhereOptions;
  scope: string | boolean;
  schema: string;
}
