import {Table, Model, Column,} from "../../../../../src";

@Table
export default class PlayerGlob extends Model {
  @Column
  name: string;
}
