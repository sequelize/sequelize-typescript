import {Table, Model, Column} from "../../../../index";

@Table
export default class TeamDir extends Model<TeamDir> {

  @Column
  name: string;
}
