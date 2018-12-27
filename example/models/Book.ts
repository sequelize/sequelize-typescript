import {Model, Table, Column, BelongsToMany, Scopes, DataType} from '../../src';
import {Author} from "./Author";

@Scopes({
  withAuthors: {include: [{
    model: () => Author,
    through: {attributes: []}
  }]}
})
@Table
export default class Book extends Model<Book> {

  @Column({
    type: DataType.STRING(50)
  })
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
