import {bookshelf} from "../bookshelf";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";
import {IOperator} from "../interfaces/IOperator";

@Table
export class Operator extends bookshelf.Model<Operator> implements IOperator {

  @Column
  id: string;

  @Column
  name: string;
  
  parentId: string;
}
