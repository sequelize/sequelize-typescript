import {Table, Column, Model} from '../../../src';

@Table
export class Game extends Model {

  @Column
  title: string;
}
