import {Table, Model, Column,} from "../../../../../index";

@Table
export default class PlayerGlob extends Model<PlayerGlob> {
  @Column
  name: string;
}
