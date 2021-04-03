import { Table, Model, PrimaryKey, AutoIncrement, Column } from '../../src';

@Table({
  timestamps: true,
})
export class TimeStampsUser extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  aNumber: number;

  @Column
  username: string;

  @Column
  updatedAt: Date;
}
