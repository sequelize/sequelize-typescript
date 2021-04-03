import { Table, Model, Column } from '../../../../src';

@Table
export default class PlayerDir extends Model {
  @Column
  name: string;
}
