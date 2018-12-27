import {Table, Model, Column} from "../../src";

@Table
export class Box extends Model<Box> {

  @Column
  length: number;

  @Column
  width: number;

  @Column
  height: number;
}
