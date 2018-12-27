import {Table, Model, Column, DataType} from "../../src";

@Table
export class UserWithNoAutoIncrementation extends Model<UserWithNoAutoIncrementation> {

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: false,
    primaryKey: true
  })
  id: number;

  @Column
  username: string;

}
