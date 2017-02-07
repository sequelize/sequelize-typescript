import {Model, Table, PrimaryKey, Column, ForeignKey} from "sequelize-typescript";
import {User} from "./User";
import {Post} from "./Post";

@Table
export class PostAuthor extends Model {

  @ForeignKey(() => User)
  authorId: number;

  @ForeignKey(() => Post)
  postId: number;
}
