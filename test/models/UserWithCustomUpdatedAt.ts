import { Table, Model, Column } from '../../src';

@Table({ timestamps: false })
export class UserWithCustomUpdatedAt extends Model {
  @Column
  name: string;

  @Column
  updatedAt: Date;
}
