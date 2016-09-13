import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {EVSEChargingFacility} from "./EVSEChargingFacility";
import {EVSE} from "./EVSE";
import {BelongsToMany} from "../orm/annotations/BelongsToMany";
import {DataType} from "../orm/models/DataType";
import {Plug} from "./Plug";
import {PlugChargingFacility} from "./PlugChargingFacility";

@Table
export class ChargingFacility extends Model<ChargingFacility> {

  @Column
  @PrimaryKey
  id: number;

  @Column
  option: string;

  @Column
  power: string;

  @BelongsToMany(() => EVSE, () => EVSEChargingFacility)
  evses;

  @BelongsToMany(() => Plug, () => PlugChargingFacility)
  plugs;
}
