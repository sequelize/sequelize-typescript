import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsTo, ForeignKey} from "../../index";
import {Post} from "./Post";
import {Author} from "./Author";

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

  @ForeignKey(() => Author)
  @Column
  userId: number;

  @BelongsTo(() => Author)
  user;

}
