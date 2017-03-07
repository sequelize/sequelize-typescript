import {Table, Model, Column, ForeignKey, BelongsTo,
  DefaultScope, Scopes} from "../../index";
import {Manufacturer} from "./Manufacturer";

export const SHOE_DEFAULT_SCOPE = {
  attributes: ['id', 'primaryColor', 'secondaryColor', 'producedAt']
};
export const SHOE_SCOPES = {
  full: {
    include: [() => Manufacturer]
  },
  yellow: {
    where: {primaryColor: 'yellow'}
  }
};

@DefaultScope(SHOE_DEFAULT_SCOPE)
@Scopes(SHOE_SCOPES)
@Table
export class ShoeWithScopes extends Model<ShoeWithScopes> {

  @Column
  readonly secretKey: string;

  @Column
  primaryColor: string;

  @Column
  secondaryColor: string;

  @Column
  producedAt: Date;

  @ForeignKey(() => Manufacturer)
  @Column
  manufacturerId: number;

  @BelongsTo(() => Manufacturer)
  manufacturer: Manufacturer;

}
