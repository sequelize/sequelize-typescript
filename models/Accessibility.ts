import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {DataType} from "../orm/models/DataType";
import {Model} from "../orm/models/Model";

@Table
export class Accessibility extends Model<Accessibility> {

  @Column({
    primaryKey: true,
    type: DataType.INTEGER
  })
  id: number;

  @Column
  option: string;
  
}
