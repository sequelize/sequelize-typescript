import {Table, Model, ForeignKey, Column, BelongsTo, DataType} from "../../src";
import {Book} from "./Book";

@Table
export class Page extends Model {

  @Column(DataType.TEXT)
  content: string;

  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @BelongsTo(() => Book)
  book: Book;
}
