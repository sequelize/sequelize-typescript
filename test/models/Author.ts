import {Table, Model, PrimaryKey, Column, AutoIncrement} from "../../index";
import {BelongsToMany} from "../../lib/annotations/association/BelongsToMany";
import {AuthorFriend} from "./AuthorFriend";

@Table
export class Author extends Model<Author> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  aNumber: number;

  @Column
  bNumber: number;

  @BelongsToMany(() => Author, () => AuthorFriend, 'userId', 'friendId')
  friends: Author[];

}
