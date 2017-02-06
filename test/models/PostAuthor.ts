import {Model, Table, PrimaryKey, Column, ForeignKey} from "../../index";
import {User} from "./User";
import {Post} from "./Post";

@Table
export class PostAuthor extends Model {

  @ForeignKey(() => User)
  @PrimaryKey
  @Column
  authorId: number;

  @ForeignKey(() => Post)
  @PrimaryKey
  @Column
  postId: number;
}
