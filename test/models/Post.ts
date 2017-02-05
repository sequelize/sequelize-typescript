import {Table, Model, PrimaryKey, Column, AutoIncrement} from "../../index";
import {HasMany} from "../../lib/annotations/HasMany";
import {Comment} from "../Comment";

@Table
export class Post extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  text: string;

  // @HasMany(() => Comment)
  // comments;

}
