import {Table, Model, Column} from "../../../../index";

@Table
export default class ShoeDir extends Model<ShoeDir> {

  @Column
  brand: string;

}
