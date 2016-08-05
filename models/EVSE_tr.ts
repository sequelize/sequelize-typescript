import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {IEVSE_tr} from "../interfaces/models/IEVSE_tr";

@Table
export class EVSE_tr extends Model<EVSE_tr> implements IEVSE_tr {

  @Column
  @PrimaryKey
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column
  @PrimaryKey
  languageCode: string;

  @Column
  additionalInfo: string;

  @Column
  chargingStationName: string;
  
}
