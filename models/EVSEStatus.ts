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

  @Column
  @PrimaryKey
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column
  @PrimaryKey
  @ForeignKey(() => Status)
  statusId: number;

}
