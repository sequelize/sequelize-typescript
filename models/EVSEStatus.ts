import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {Status} from "./Status";
import {IEVSEStatus} from "../interfaces/models/IEVSEStatus";

@Table
export class EVSEStatus extends Model<EVSEStatus> implements IEVSEStatus {

  // Please notice, that this foreign key
  // does not exist in the real database
  // schema; Some of the status data does
  // not have a corresponding EVSE entry
  // in the database. Because of the huge
  // amount of data and for performance
  // reasons the existence of each EVSE
  // entry, which is referred in the
  // status entry, is not checked
  @Column
  @PrimaryKey
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column
  @PrimaryKey
  @ForeignKey(() => Status)
  statusId: number;

}
