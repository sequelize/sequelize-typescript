import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsToMany,
DefaultScope, Scopes} from "../../index";
import {AuthorFriend} from "./AuthorFriend";

@DefaultScope({
  attributes: ['id', 'name']
})
@Scopes({
  full: {
    include: [() => Author]
  }
})
@Table
export class Author extends Model<Author> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  secret: string;

  @BelongsToMany(() => Author, () => AuthorFriend, 'authorId', 'friendId')
  friends: Author[];

}
