import {Table, Model, Column} from "../../src";

@Table
export class Box extends Model {

  @Column
  length: number;

  @Column
  width: number;

  @Column
  height: number;
}
