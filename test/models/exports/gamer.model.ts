import {Table, Column, Model} from '../../../index';

@Table
export default class Gamer extends Model<Gamer> {

  @Column
  nickname: string;
}
