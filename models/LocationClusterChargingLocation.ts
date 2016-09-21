import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {DataType} from "../orm/models/DataType";
import {EVSE} from "./EVSE";
import {HasMany} from "../orm/annotations/HasMany";
import {BelongsTo} from "../orm/annotations/BelongsTo";
import {ChargingLocation} from "./ChargingLocation";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {LocationCluster} from "./LocationCluster";

@Table
export class LocationClusterChargingLocation extends Model<LocationClusterChargingLocation> implements ILocationClusterChargingLocation {

  @Column
  @PrimaryKey
  @ForeignKey(() => LocationCluster)
  locationClusterId: number;

  @Column
  @PrimaryKey
  @ForeignKey(() => ChargingLocation)
  chargingLocationId: number;
}
