import {Table, Column, Model} from '../../../../index';

export const MatchN = 'Not a model';
export const NMatch = 'Not a model';

@Table
export class Match extends Model<Match> {

  @Column
  title: string;
}
