// Types only test. This should compile successfully.

import {Column} from '../../src/model/column/column';
import {Model} from '../../src/model/model/model';
import {Table} from '../../src/model/table/table';
import {DataType} from '../../src/sequelize/data-type/data-type';
import {Scopes} from "../../src/scopes/scopes";
import {DefaultScope} from "../../src/scopes/default-scope";

@DefaultScope(() => ({
  order: [['myCol', 'ASC']],
}))
@Scopes(() => ({
  desc: {
    order: [['myCol', 'DESC']],
  }
}))
@Table
export class User extends Model<User> {
  @Column(DataType.ARRAY(DataType.STRING))
  myCol: string[];
}
