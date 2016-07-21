import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {DataType} from "../orm/models/DataType";
import {EVSE} from "./EVSE";
import {HasMany} from "../orm/annotations/HasMany";

@Table
export class ChargingLocation extends Model<ChargingLocation> implements IChargingLocation {

  @Column
  @PrimaryKey
  id: number;

  @Column({
    type: DataType.DECIMAL
  })
  longitude: number;

  @Column({
    type: DataType.DECIMAL
  })
  latitude: number;

  @HasMany(() => EVSE)
  evses: EVSE[];

}
