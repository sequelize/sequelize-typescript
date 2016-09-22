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
import {BelongsToMany} from "../orm/annotations/BelongsToMany";
import {LocationClusterChargingLocation} from "./LocationClusterChargingLocation";

@Table
export class LocationCluster extends Model<LocationCluster> implements ILocationCluster {

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

  @Column({
    type: DataType.VIRTUAL
  })
  groupCount: number;

  @Column
  epsilon: number;

  @BelongsToMany(() => ChargingLocation, () => LocationClusterChargingLocation)
  chargingLocations: ChargingLocation[];

  @Column({
    type: DataType.VIRTUAL,
    get() {
      
      // TODO Hier gehört nicht alles hin ;)
      
      const chargingLocations = this.getDataValue('chargingLocations');
      const groupCount = chargingLocations.length;
      let evses;

      if (chargingLocations && groupCount === 1) {

        this.setDataValue('id', chargingLocations[0].id);
        delete this.dataValues.groupCount;

        evses = chargingLocations[0].evses;
      } else {
        this.setDataValue('groupCount', groupCount);
      }

      delete this.dataValues.chargingLocations;

      return evses;
    }
  })
  evses: EVSE[];
}
