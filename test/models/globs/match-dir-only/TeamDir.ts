import {Table, Model, Column} from "../../../../src";

@Table
export default class TeamDir extends Model<TeamDir> {

  @Column
  name: string;
}
