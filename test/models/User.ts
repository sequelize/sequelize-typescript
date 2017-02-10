import {Table, Model, PrimaryKey, Column, AutoIncrement} from "../../index";
import {BelongsToMany} from "../../lib/annotations/BelongsToMany";
import {UserFriend} from "./UserFriend";

@Table
export class User extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @BelongsToMany(() => User, () => UserFriend, 'userId', 'friendId')
  friends: User[];

}
