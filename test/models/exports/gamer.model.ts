import {Table, Column, Model} from '../../../src';

@Table
export default class Gamer extends Model<Gamer> {

  @Column
  nickname: string;
}
