import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {ChargingFacility} from "./ChargingFacility";
import {IEVSEChargingFacility} from "../interfaces/IEVSEChargingFacility";

@Table
export class EVSEChargingFacility extends Model<EVSEChargingFacility> implements IEVSEChargingFacility {

  @Column
  @PrimaryKey
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column
  @PrimaryKey
  @ForeignKey(() => ChargingFacility)
  chargingFacilityId: number;

}
