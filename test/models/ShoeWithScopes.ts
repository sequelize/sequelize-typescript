import {Table, Model, Column, ForeignKey, BelongsTo,
  DefaultScope, Scopes} from "../../src";
import {Manufacturer} from "./Manufacturer";
import {Person} from "./Person";

export const SHOE_DEFAULT_SCOPE_GETTER = () => ({
  attributes: ['id', 'primaryColor', 'secondaryColor', 'producedAt']
});
export const SHOE_SCOPES__GETTER = () => ({
  full: {
    include: [Manufacturer]
  },
  yellow: {
    where: {primaryColor: 'yellow'}
  },
  red: {
    where: {primaryColor: 'red'}
  },
  noImg: {
    where: {img: null}
  },
  manufacturerWithScope: {
    include: [Manufacturer.scope('brandOnly')]
  },
  primaryColor: primaryColor => ({
      where: {primaryColor}
    }
  ),
  primaryColorWithManufacturer: primaryColor => ({
      include: [Manufacturer],
      where: {primaryColor},
    }
  )
});

@DefaultScope(SHOE_DEFAULT_SCOPE_GETTER)
@Scopes(SHOE_SCOPES__GETTER)
@Table
export class ShoeWithScopes extends Model {

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
