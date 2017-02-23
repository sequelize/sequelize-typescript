import {Table, Model, Column, DataType} from "../../index";

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
