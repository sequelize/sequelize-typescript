import {bookshelf} from "../bookshelf";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";

@Table
export class ChargingFacility extends bookshelf.Model<ChargingFacility> {

  @Column
  id: number;

  @Column
  option: string;
  
}
