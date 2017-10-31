import {Table, Model, Column} from "../../../../../index";

@Table
export default class TeamGlob extends Model<TeamGlob> {

  @Column
  name: string;
}
