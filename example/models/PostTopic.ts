import {Model, Table, PrimaryKey, Column, ForeignKey} from "../../src";
import {Post} from "./Post";
import {Topic} from "./Topic";

@Table
export class PostTopic extends Model<PostTopic> {

  @ForeignKey(() => Post)
  @PrimaryKey
  @Column
  postId: number;

  @ForeignKey(() => Topic)
  @PrimaryKey
  @Column
  topicId: number;
}
