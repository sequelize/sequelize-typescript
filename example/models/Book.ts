import {Model, Table, Column, BelongsToMany, Scopes, DataType} from '../../index';
import {Author} from "./Author";

@Scopes({
  withAuthors: {include: [{
    model: () => Author,
    through: {attributes: []}
  }]}
})
@Table
export class Book extends Model<Book> {

  @Column
  title: string;

  @BelongsToMany(() => Author, 'AuthorBook', 'bookId', 'authorId')
  authors: Author[];

  @Column(DataType.INTEGER)
  get year(): number|string {

    return 'Published in ' + this.getDataValue('year');
  };
  set year(year: number|string) {

    this.setDataValue('year', year);
  };
}
