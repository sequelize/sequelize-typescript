import {Column, Model, Table} from "../../index";

@Table({version: true})
export class UserWithVersion extends Model<UserWithVersion> {

  @Column
  name: string;

}
