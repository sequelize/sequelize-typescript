import {Table, Model, Column, HasMany} from "../../index";
import {Player} from "./Player";

@Table
export class Team extends Model {

  @Column
  name: string;

  @HasMany(() => Player)
  players: Player[];
}
