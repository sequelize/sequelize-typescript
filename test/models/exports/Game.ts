import {Table, Column, Model} from '../../../index';

@Table
export class Game extends Model<Game> {

  @Column
  title: string;
}
