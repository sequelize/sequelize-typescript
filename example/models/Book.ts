import {Model, Table, Column, BelongsToMany, Scopes} from '../../index';
import {Author} from "./Author";

@Scopes({
  withAuthors: {include: [() => Author]}
})
@Table
export class Book extends Model<Book> {

  @Column
  title: string;

  @BelongsToMany(() => Author, 'AuthorBook', 'bookId', 'authorId')
  authors: Author[];
}
