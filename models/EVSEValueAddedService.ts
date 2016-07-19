import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {ValueAddedService} from "./ValueAddedService";
import {IEVSEValueAddedService} from "../interfaces/models/IEVSEValueAddedService";

@Table
export class EVSEValueAddedService extends Model<EVSEValueAddedService> implements IEVSEValueAddedService {

  @Column
  @PrimaryKey
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column
  @PrimaryKey
  @ForeignKey(() => ValueAddedService)
  valueAddedServiceId: number;

}
