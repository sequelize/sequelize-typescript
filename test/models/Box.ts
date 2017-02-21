import {Table, Model, Column} from "../../index";

@Table
export class Box extends Model {

  @Column
  length: number;

  @Column
  width: number;

  @Column
  height: number;
}
