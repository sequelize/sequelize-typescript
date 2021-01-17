import {Model, Table, Column, ForeignKey, BelongsTo} from 'sequelize-typescript';

import {User} from '../users/User';

@Table
export class Post extends Model {

  @Column text!: string;
  @ForeignKey(() => User) @Column userId!: number;
  @BelongsTo(() => User) user: User;
}
