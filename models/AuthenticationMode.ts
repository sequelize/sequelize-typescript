import {bookshelf} from "../bookshelf";
import {Table} from "../annotations/Table";
import {Column} from "../annotations/Column";

@Table
export class AuthenticationMode extends bookshelf.Model<AuthenticationMode> {

  @Column
  id: number;

  @Column
  option: string;
  
}
