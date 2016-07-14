import {bookshelf} from "../bookshelf";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";
import {ForeignKey} from "../annotations/ForeignKey";
import {EVSE} from "./EVSE";
import {Plug} from "./Plug";

@Table
export class EVSEPlug extends bookshelf.Model<EVSEPlug> {

  @Column
  @ForeignKey(() => EVSE)
  evseId: string;

  @Column
  @ForeignKey(() => Plug)
  plugId: number;

}
