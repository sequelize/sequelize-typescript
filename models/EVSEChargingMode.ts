import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {ChargingMode} from "./ChargingMode";
import {IEVSEChargingMode} from "../interfaces/models/IEVSEChargingMode";

@Table
export class EVSEChargingMode extends Model<EVSEChargingMode> implements IEVSEChargingMode {

  @Column
  @PrimaryKey
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column
  @PrimaryKey
  @ForeignKey(() => ChargingMode)
  chargingModeId: number;

}
