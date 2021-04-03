// Types only test. This should compile successfully.

import { Column } from '../../src/model/column/column';
import { Model } from '../../src/model/model/model';
import { Table } from '../../src/model/table/table';
import { DataType } from '../../src/sequelize/data-type/data-type';

@Table
export class User extends Model {
  @Column(DataType.ARRAY(DataType.STRING))
  myCol: string[];
}

@Table<Post>({
  hooks: {
    beforeUpdate: (instance) => {
      // without generic random will result in error
      instance.random = 4;
    },
  },
})
export class Post extends Model {
  @Column(DataType.INTEGER)
  random: number;
}
