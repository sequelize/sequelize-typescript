import {Column, Model, Table} from "../../src";

@Table({version: true})
export class UserWithVersion extends Model<UserWithVersion> {

  @Column
  name: string;

}
