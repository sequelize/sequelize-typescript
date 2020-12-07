import {Table, Model, Column} from "../../../../../src";

@Table
export default class ShoeGlob extends Model {

  @Column
  brand: string;

}
