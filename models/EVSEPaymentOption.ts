import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {Model} from "../orm/models/Model";
import {EVSE} from "./EVSE";
import {PaymentOption} from "./PaymentOption";
import {IEVSEPaymentOption} from "../interfaces/models/IEVSEPaymentOption";

@Table
export class EVSEPaymentOption extends Model<EVSEPaymentOption> implements IEVSEPaymentOption {

  @Column
  @PrimaryKey
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column
  @PrimaryKey
  @ForeignKey(() => PaymentOption)
  paymentOptionId: number;

}
