import {Table, Model, Column, HasMany} from "../../src";
import {Page} from "./Page";

@Table
export class Book extends Model<Book> {

  @Column
  title: string;

  @HasMany(() => Page)
  pages: Page[];
}
