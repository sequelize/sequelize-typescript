import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {EVSEChargingFacility} from "./EVSEChargingFacility";
import {EVSE} from "./EVSE";
import {BelongsToMany} from "../orm/annotations/BelongsToMany";
import {DataType} from "../orm/models/DataType";

@Table
export class ChargingFacility extends Model<ChargingFacility> {

  @Column
  @PrimaryKey
  id: number;

  @Column
  option: string;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      // todo
      return this.getDataValue('option');
    }
  })
  kw: string;

  @BelongsToMany(() => EVSE, () => EVSEChargingFacility)
  evses;
}
