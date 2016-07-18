import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {BelongsToMany} from "../orm/annotations/BelongsToMany";
import {Model} from "../orm/models/Model";
import {EVSEStatus} from "./EVSEStatus";
import {EVSE} from "./EVSE";

@Table
export class Status extends Model<Status> {

  @Column
  @PrimaryKey
  id: number;

  @Column
  option: string;

  @BelongsToMany(() => EVSE, () => EVSEStatus)
  evses;
}
