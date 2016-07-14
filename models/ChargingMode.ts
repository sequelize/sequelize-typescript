import {bookshelf} from "../bookshelf";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";

@Table
export class ChargingMode extends bookshelf.Model<ChargingMode> {

  @Column
  id: number;

  @Column
  option: string;
  
}
