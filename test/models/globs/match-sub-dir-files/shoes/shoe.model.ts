import {Table, Model, Column} from "../../../../../index";

@Table
export default class ShoeGlob extends Model<ShoeGlob> {

  @Column
  brand: string;

}
