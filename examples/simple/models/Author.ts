import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsToMany,
DefaultScope, Scopes} from "../../../src";
import {AuthorFriend} from "./AuthorFriend";
import Book from "./Book";

@DefaultScope({
  attributes: ['id', 'name']
})
@Scopes({
  full: {
    include: [
      () => Author,
      () => Book
    ]
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

  @Column({
    field: 'secretKey'
  })
  secret: string;

  @BelongsToMany(() => Author, () => AuthorFriend, 'authorId', 'friendId')
  friends: Author[];

  @BelongsToMany(() => Book, 'AuthorBook', 'authorId', 'bookId')
  books: Book[];

}
