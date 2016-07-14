import {bookshelf} from "../bookshelf";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";

@Table
export class PaymentOption extends bookshelf.Model<PaymentOption> {

  @Column
  id: number;

  @Column
  option: string;
  
}
