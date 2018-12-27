import {
  Table, Model, PrimaryKey, Column, AutoIncrement, BelongsToMany,
  ForeignKey, BelongsTo, HasMany, Scopes
} from "../../src";
import {Comment} from "./Comment";
import {PostTopic} from "./PostTopic";
import {Topic} from "./Topic";
import {Author} from "./Author";

@Scopes({
  full: {
    include: [
      {
        model: () => Comment,
        include: [() => Author]
      },
      {
        model: () => Author
      }
    ]
  }
})
@Table
export class Post extends Model<Post> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    field: '_text_'
  })
  text: string;

  @HasMany(() => Comment)
  comments;

  @BelongsToMany(() => Topic, () => PostTopic)
  topics: Topic[];

  @ForeignKey(() => Author)
  @Column
  authorId: number;

  @BelongsTo(() => Author)
  author?: Author;

}
