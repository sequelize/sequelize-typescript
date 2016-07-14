import {bookshelf} from "../bookshelf";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";

@Table
export class ValueAddedService extends bookshelf.Model<ValueAddedService> {

  @Column
  id: number;

  @Column
  option: string;
  
}
