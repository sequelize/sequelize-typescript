import {Model, Table, PrimaryKey, Column, ForeignKey} from "../../index";
import {User} from "./User";

@Table
export class UserFriend extends Model {

  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  userId: number;

  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  friendId: number;
}
