import {Table, Model, PrimaryKey, AutoIncrement, Column, HasMany} from "../../index";
import {Player} from "./Player";

@Table
export class Team extends Model<Team> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @HasMany(() => Player)
  players: Player[];
}
