import {Table, Model, Column,} from "../../../../../src";

@Table
export default class PlayerGlob extends Model<PlayerGlob> {
  @Column
  name: string;
}
