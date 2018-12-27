import {Table, Model, ForeignKey, Column, BelongsTo} from "../../src";
import {Player} from "./Player";

export const SHOE_TABLE_NAME = 'Glove';

@Table({
  tableName: SHOE_TABLE_NAME
})
export class Shoe extends Model<Shoe> {

  @Column
  brand: string;

  @ForeignKey(() => Player)
  @Column
  playerId: number;

  @BelongsTo(() => Player)
  player: Player;
}
