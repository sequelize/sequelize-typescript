import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {Default} from "../orm/annotations/Default";
import {DataType} from "../orm/models/DataType";
import {AutoIncrement} from "../orm/annotations/AutoIncrement";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {BelongsTo} from "../orm/annotations/BelongsTo";
import {Model} from "../orm/models/Model";
import {User} from "./User";
import {EVSE} from "./EVSE";

@Table
export class UserCharging extends Model<UserCharging> implements IUser {

  @Column
  @PrimaryKey
  @AutoIncrement
  id: number;

  @Column
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  @ForeignKey(() => EVSE)
  evseId: string;

  @BelongsTo(() => EVSE)
  evse: EVSE;

  @Column
  session: string;

  @Column
  @Default(DataType.NOW)
  startedAt: Date;

  @Column
  stoppedAt: Date;
}
