import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {Plug} from "./Plug";
import {DataType} from "../orm/models/DataType";
import {IEVSEPlug} from "../interfaces/models/IEVSEPlug";

@Table
export class EVSEPlug extends Model<EVSEPlug> implements IEVSEPlug {

  @Column({
    primaryKey: true,
    type: DataType.STRING
  })
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column({
    primaryKey: true,
    type: DataType.INTEGER
  })
  @ForeignKey(() => Plug)
  plugId: number;

}
