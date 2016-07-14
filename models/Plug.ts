import {bookshelf} from "../bookshelf";
import {EVSE} from "./EVSE";
import {EVSEPlug} from "./EVSEPlug";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";
import {BelongsToMany} from "../annotations/BelongsToMany";

@Table
export class Plug extends bookshelf.Model<Plug> {

  @Column
  id: number;

  @Column
  option: string;

  @BelongsToMany(() => EVSE, () => EVSEPlug)
  evses;

}
