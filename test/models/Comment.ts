import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsTo, ForeignKey, Length} from "../../index";
import {Post} from "./Post";
import {Author} from "./Author";
import {DataType} from "../../lib/enums/DataType";

@Table
export class Comment extends Model<Comment> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Length({min: 1, max: 2, msg: 'wrong length'})
  @Column(DataType.TEXT)
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
