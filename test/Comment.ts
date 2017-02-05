import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsTo} from "../index";
import {Post} from "./models/Post";
import {ForeignKey} from "../lib/annotations/ForeignKey";

@Table
export class Comment extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  text: string;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @BelongsTo(() => Post)
  post;

}
