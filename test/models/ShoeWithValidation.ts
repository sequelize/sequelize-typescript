import {
  Table, Model, Column, PrimaryKey, DataType,
  Equals, Contains, Is, IsDate, Length, IsUrl, IsAfter, IsBefore,
  IsUUID, IsAlpha, IsAlphanumeric, IsEmail, IsInt, IsDecimal, IsFloat,
  IsIn, IsIP, IsIPv4, IsIPv6, IsLowercase, IsUppercase, Max, Min,
  Not, NotContains, NotIn, NotNull, Validate
} from "../../index";
import {IsCreditCard} from "../../lib/annotations/validation/IsCreditCard";

export const HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export function hexColor(value: string): void {
  if (!HEX_REGEX.test(value)) {
    throw new Error(`"${value}" is not a hex color value.`);
  }
}
export const UUID_VERSION = 4;
export const IS_IN = [['a', 'b']];
export const NOT_CONTAINS = 'b';
export const NOT = /b/;
export const MAX = 100;
export const MIN = -100;
export const KEY_VALUE = 'READONLY';
export const PARTIAL_SPECIAL_VALUE = 'Special';
export const PRODUCED_AT_IS_AFTER = '1987-04-04';
export const PRODUCED_AT_IS_BEFORE = '2017-02-27';
export const BRAND_LENGTH = {min: 3, max: 15};

@Table
export class ShoeWithValidation extends Model<ShoeWithValidation> {

  @IsUUID(UUID_VERSION)
  @PrimaryKey
  @Column
  id: string;

  @Equals(KEY_VALUE)
  @Column
  readonly key: string;

  @Contains(PARTIAL_SPECIAL_VALUE)
  @Column
  special: string;

  @Length(BRAND_LENGTH)
  @Column
  brand: string;

  @IsUrl
  @Column
  brandUrl: string;

  @Is('HexColor', hexColor)
  @Column
  primaryColor: string;

  @Is(hexColor)
  @Column
  secondaryColor: string;

  @Is(HEX_REGEX)
  @Column
  tertiaryColor: string;

  @IsDate
  @IsAfter(PRODUCED_AT_IS_AFTER)
  @IsBefore(PRODUCED_AT_IS_BEFORE)
  @Column
  producedAt: Date;

  @IsCreditCard
  @IsAlpha
  @IsAlphanumeric
  @IsEmail
  @IsDecimal
  @IsFloat
  @IsInt
  @IsIP
  @IsIPv4
  @IsIPv6
  @IsLowercase
  @IsUppercase
  @NotNull
  @Max(MAX)
  @Min(MIN)
  @Not(NOT)
  @IsIn(IS_IN)
  @NotIn(IS_IN)
  @NotContains(NOT_CONTAINS)
  @Validate({isArray: true})
  @Column(DataType.STRING)
  dummy: any;
}
