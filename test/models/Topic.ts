import {Table, Model, PrimaryKey, AutoIncrement, Column, BelongsToMany} from "../../index";
import {Post} from "./Post";
import {PostTopic} from "./PostTopic";

@Table
export class Topic extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

  @BelongsToMany(() => Post, () => PostTopic)
  post: Post[];

}
