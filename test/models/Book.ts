import {Table, Model, Column, HasMany} from "../../index";
import {Page} from "./Page";

@Table
export class Book extends Model {

  @Column
  title: string;

  @HasMany(() => Page)
  pages: Page[];
}
