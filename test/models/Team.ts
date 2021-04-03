import { Table, Model, PrimaryKey, AutoIncrement, Column, HasMany } from '../../src';
import { Player } from './Player';

@Table
export class Team extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @HasMany(() => Player)
  players: Player[];
}
