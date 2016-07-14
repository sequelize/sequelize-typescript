import {bookshelf} from "../bookshelf";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";

@Table
export class Accessibility extends bookshelf.Model<Accessibility> {

  @Column
  id: number;

  @Column
  option: string;
  
}
