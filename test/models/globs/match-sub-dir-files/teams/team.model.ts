import {Table, Model, Column} from "../../../../../src";

@Table
export default class TeamGlob extends Model<TeamGlob> {

  @Column
  name: string;
}
