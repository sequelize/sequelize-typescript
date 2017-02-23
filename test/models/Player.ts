import {Table, Model, PrimaryKey, ForeignKey, Column, AutoIncrement, HasOne, BelongsTo} from "../../index";
import {Team} from "./Team";
import {Shoe} from "./Shoe";

@Table
export class Player extends Model<Player> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @HasOne(() => Shoe)
  shoe: Shoe;

  @ForeignKey(() => Team)
  @Column
  teamId: number;

  @BelongsTo(() => Team)
  team: Team;
}
