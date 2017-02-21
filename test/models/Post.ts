import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsToMany} from "../../index";
import {HasMany} from "../../lib/annotations/HasMany";
import {Comment} from "./Comment";
import {PostTopic} from "./PostTopic";
import {Topic} from "./Topic";
import {ForeignKey} from "../../lib/annotations/ForeignKey";
import {Author} from "./Author";
import {BelongsTo} from "../../lib/annotations/BelongsTo";

@Table
export class Post extends Model {

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
  userId: number;

  @BelongsTo(() => Author)
  user: Author;

}
