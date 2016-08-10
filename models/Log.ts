import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {BelongsToMany} from "../orm/annotations/BelongsToMany";
import {DataType} from "../orm/models/DataType";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {EVSEPlug} from "./EVSEPlug";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {AutoIncrement} from "../orm/annotations/AutoIncrement";

@Table
export class Log extends Model<Log> {

  @Column
  @PrimaryKey
  @AutoIncrement
  id: number;

  @Column
  userId: number;

  @Column
  appVersion: string;

  @Column
  appUrl: string;

  @Column
  message: string;

  @Column
  cause: string;
}
