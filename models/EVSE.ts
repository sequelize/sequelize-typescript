import {bookshelf} from "../bookshelf";
import {Plug} from "./Plug";
import {EVSEPlug} from "./EVSEPlug";
import {Column} from "../annotations/Column";
import {BelongsToMany} from "../annotations/BelongsToMany";
import {PrimaryKey} from "../annotations/PrimaryKey";
import {Table} from "../annotations/Table";

@Table
export class EVSE extends bookshelf.Model<EVSE> implements IEVSE{

  @Column
  @PrimaryKey
  id: string;

  // address
  @Column
  country: string;

  @Column
  city: string;

  @Column
  street: string;

  @Column
  postalCode: string;

  @Column
  houseNum: string;

  @Column
  floor: string;

  @Column
  region: string;

  @Column
  timezone: string;

  // geo location
  @Column
  longitude: number;

  @Column
  latitude: number;
  
  @Column
  entranceLongitude: number;

  @Column
  entranceLatitude: number;

  //
  @Column
  maxCapacity: number;

  @Column // todo relation
  accessibilityId: number;

  @Column // todo relation
  operatorId: string;

  @Column
  chargingStationId: string;

  @Column
  chargingStationName: string;

  @Column
  lastUpdate: string;

  @Column
  additionalInfo: string;

  @Column
  isOpen24Hours: boolean;

  @Column
  openingTime: string;

  @Column
  hubOperatorId: string;

  @Column
  clearinghouseId: string;

  @Column
  isHubjectCompatible: boolean;

  @Column
  dynamicInfoAvailable: string;

  @Column
  hotlinePhoneNum: string;

  @BelongsToMany(() => Plug, () => EVSEPlug)
  plugs;

}
