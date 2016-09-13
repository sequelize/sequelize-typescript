import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {Model} from "../orm/models/Model";
import {Plug} from "./Plug";
import {ChargingFacility} from "./ChargingFacility";

@Table
export class PlugChargingFacility extends Model<PlugChargingFacility> {

  @Column
  @PrimaryKey
  @ForeignKey(() => Plug)
  plugId: number;

  @Column
  @PrimaryKey
  @ForeignKey(() => ChargingFacility)
  chargingFacilityId: number;
}
