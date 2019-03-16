import {Model, Table, Column, HasMany} from 'sequelize-typescript';

import {Post} from '../posts/Post';

@Table
export class User extends Model<User> {

  @Column name!: string;
  @HasMany(() => Post) posts: Post[];

}
