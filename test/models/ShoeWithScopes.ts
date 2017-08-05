import {Table, Model, Column, ForeignKey, BelongsTo,
  DefaultScope, Scopes} from "../../index";
import {Manufacturer} from "./Manufacturer";
import {Person} from "./Person";

export const SHOE_DEFAULT_SCOPE = {
  attributes: ['id', 'primaryColor', 'secondaryColor', 'producedAt']
};
export const SHOE_SCOPES = {
  full: {
    include: [() => Manufacturer]
  },
  yellow: {
    where: {primaryColor: 'yellow'}
  },
  red: {
    where: {primaryColor: 'red'}
  },
  manufacturerWithScope: {
    include: [() => Manufacturer.scope('brandOnly')]
  },
  primaryColor: primaryColor => ({
      where: {primaryColor}
    }
  )
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
  img: Buffer;

  @Column
  producedAt: Date;

  @ForeignKey(() => Manufacturer)
  @Column
  manufacturerId: number;

  @BelongsTo(() => Manufacturer)
  manufacturer: Manufacturer;

  @ForeignKey(() => Person)
  @Column
  ownerId: number;

  @BelongsTo(() => Person)
  owner: Person;

}
