import {Table, Model, ForeignKey, Column, BelongsTo, DataType} from "../../index";
import {Book} from "./Book";

@Table
export class Page extends Model {

  @Column({
    type: DataType.TEXT
  })
  content: string;

  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @BelongsTo(() => Book)
  book: Book;
}
