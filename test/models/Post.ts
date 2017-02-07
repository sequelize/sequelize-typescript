import {Table, Model, PrimaryKey, Column, AutoIncrement, BelongsToMany} from "sequelize-typescript";
import {HasMany} from "../../lib/annotations/HasMany";
import {Comment} from "./Comment";
import {User} from "./User";
import {PostAuthor} from "./PostAuthor";

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

  @BelongsToMany(() => User, () => PostAuthor)
  authors: User[];

}
