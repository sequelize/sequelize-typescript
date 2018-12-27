import {Table, Model, Column,} from "../../../../src";

@Table
export default class PlayerDir extends Model<PlayerDir> {
  @Column
  name: string;
}
