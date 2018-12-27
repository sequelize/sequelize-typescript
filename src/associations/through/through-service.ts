import {Table} from '../../model/table/table';
import {Model} from '../../model/model/model';

export const getThroughModel = (through: string): typeof Model => {
  @Table({tableName: through, modelName: through})
  class Through extends Model<Through> {
  }
  return Through;
};
