import {Table, Model, Column, HasMany, Scopes} from "../../index";
import {ShoeWithScopes} from "./ShoeWithScopes";

@Scopes({
  brandOnly: {
    attributes: {
      exclude: ['notInScopeBrandOnly']
    }
  }
})
@Table
export class Manufacturer extends Model<Manufacturer> {

  @Column
  brand: string;

  @Column
  notInScopeBrandOnly: string;

  @HasMany(() => ShoeWithScopes)
  shoes: ShoeWithScopes[];
}
