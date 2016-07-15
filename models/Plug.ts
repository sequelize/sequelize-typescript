import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {BelongsToMany} from "../orm/annotations/BelongsToMany";
import {DataType} from "../orm/models/DataType";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {EVSEPlug} from "./EVSEPlug";

@Table
export class Plug extends Model<Plug> {

  @Column({
    primaryKey: true,
    type: DataType.INTEGER
  })
  id: number;

  @Column
  option: string;

  @BelongsToMany(() => EVSE, () => EVSEPlug)
  evses;
}
