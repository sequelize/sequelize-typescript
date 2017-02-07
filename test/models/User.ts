import {Table, Model, PrimaryKey, Column, AutoIncrement} from "sequelize-typescript";
import {Post} from "./Post";
import {BelongsToMany} from "../../lib/annotations/BelongsToMany";
import {PostAuthor} from "./PostAuthor";

@Table
export class User extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @BelongsToMany(() => Post, () => PostAuthor)
  posts: Post[];

}
