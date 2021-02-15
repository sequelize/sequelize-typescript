import { Table, Model, Column } from '../../../../src';

@Table
export default class ShoeDir extends Model {
  @Column
  brand: string;
}
