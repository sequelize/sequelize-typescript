import { Table, Model, Column } from '../../../../../src';

@Table
export default class TeamGlob extends Model {
  @Column
  name: string;
}
