import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsTo, ForeignKey, Length} from "../../index";
import {Post} from "./Post";
import {Author} from "./Author";
import {DataType} from "../../lib/sequelize/enums/DataType";

@Table
export class Comment extends Model<Comment> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Length({min: 1, max: 100, msg: 'wrong length'})
  @Column(DataType.TEXT)
  text: string;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @BelongsTo(() => Post)
  post;

  @ForeignKey(() => Author)
  @Column
  authorId: number;

  @BelongsTo(() => Author)
  author;

}
