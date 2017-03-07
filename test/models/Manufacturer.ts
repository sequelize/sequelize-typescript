import {Table, Model, Column, HasMany} from "../../index";
import {ShoeWithScopes} from "./ShoeWithScopes";


@Table
export class Manufacturer extends Model<Manufacturer> {

  @Column
  brand: string;

  @HasMany(() => ShoeWithScopes)
  shoes: ShoeWithScopes[];
}
