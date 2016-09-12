import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {IOperator} from "../interfaces/models/IOperator";
import {BelongsTo} from "../orm/annotations/BelongsTo";
import {DataType} from "../orm/models/DataType";
import {Operator} from "./Operator";

@Table
export class OperatorInterchargeDirect extends Model<OperatorInterchargeDirect> {

  @Column
  @PrimaryKey
  @ForeignKey(() => Operator)
  operatorId: string;

  @BelongsTo(() => Operator)
  operator: Operator;
}
