import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {IOperator} from "../interfaces/models/IOperator";
import {BelongsTo} from "../orm/annotations/BelongsTo";
import {DataType} from "../orm/models/DataType";

@Table
export class Operator extends Model<Operator> implements IOperator {

  @Column
  @PrimaryKey
  id: string;

  @Column({
    type: DataType.STRING,
    get() {
      let name = this.getDataValue('name');

      if(!name) {
        let parent = this.getDataValue('parent');

        if(parent) {
         return parent.name;
        }
      }
      return name;
    }
  })
  name: string;

  @Column
  @ForeignKey(() => Operator)
  parentId: string;

  @BelongsTo(() => Operator)
  parent: Operator;

}
