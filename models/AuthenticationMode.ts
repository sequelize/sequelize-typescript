import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";

@Table
export class AuthenticationMode extends Model<AuthenticationMode> {

  @Column
  @PrimaryKey
  id: number;

  @Column
  option: string;

}
