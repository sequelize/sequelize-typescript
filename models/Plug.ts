import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {BelongsToMany} from "../orm/annotations/BelongsToMany";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {EVSEPlug} from "./EVSEPlug";
import {ChargingFacility} from "./ChargingFacility";
import {PlugChargingFacility} from "./PlugChargingFacility";

@Table
export class Plug extends Model<Plug> {

  @Column
  @PrimaryKey
  id: number;

  @Column
  option: string;

  @BelongsToMany(() => EVSE, () => EVSEPlug)
  evses;

  @BelongsToMany(() => ChargingFacility, () => PlugChargingFacility)
  chargingFacilities: ChargingFacility[];
}
