import { Table, Column, Model } from '../../../../src';

export const MatchN = 'Not a model';
export const NMatch = 'Not a model';

@Table
export class Match extends Model {
  @Column
  title: string;
}
