import {Table, Model, ForeignKey, Column, BelongsTo} from "../../index";
import {Player} from "./Player";

@Table
export class Shoe extends Model {

  @Column
  brand: string;

  @ForeignKey(() => Player)
  @Column
  playerId: number;

  @BelongsTo(() => Player)
  player: Player;
}
