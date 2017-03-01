import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsToMany} from "../../index";
import {HasMany} from "../../lib/annotations/association/HasMany";
import {Comment} from "./Comment";
import {PostTopic} from "./PostTopic";
import {Topic} from "./Topic";
import {ForeignKey} from "../../lib/annotations/ForeignKey";
import {Author} from "./Author";
import {BelongsTo} from "../../lib/annotations/association/BelongsTo";

@Table
export class Post extends Model<Post> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  text: string;

  @HasMany(() => Comment)
  comments;

  @BelongsToMany(() => Topic, () => PostTopic)
  topics: Topic[];

  @ForeignKey(() => Author)
  @Column
  authorId: number;

  @BelongsTo(() => Author)
  author: Author;

}
