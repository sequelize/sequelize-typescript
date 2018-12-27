import {Table, Column, Model} from '../../../src';

@Table
export class Game extends Model<Game> {

  @Column
  title: string;
}
