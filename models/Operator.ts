import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {IOperator} from "../interfaces/models/IOperator";

@Table
export class Operator extends Model<Operator> implements IOperator {

  @Column
  @PrimaryKey
  id: string;

  @Column
  name: string;

  @Column
  @ForeignKey(() => Operator)
  parentId: string;

}
