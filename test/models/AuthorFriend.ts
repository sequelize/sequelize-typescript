import {Model, Table, PrimaryKey, Column, ForeignKey} from "../../index";
import {Author} from "./Author";

@Table
export class AuthorFriend extends Model<AuthorFriend> {

  @ForeignKey(() => Author)
  @PrimaryKey
  @Column
  userId: number;

  @ForeignKey(() => Author)
  @PrimaryKey
  @Column
  friendId: number;
}
