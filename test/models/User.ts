import {Table, Model, PrimaryKey, Column, AutoIncrement, DataType, Default, AllowNull, Unique, Length, IsInt} from "../../src";

@Table
export class User extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1
  })
  uuidv1: string;

  @Unique
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  uuidv4: string;

  @Length({max: 20})
  @Column
  username: string;

  @Column(DataType.STRING(5))
  username2: string;

  @IsInt
  @Column
  aNumber: number;

  @Column
  bNumber: number;

  @Column
  isAdmin: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isSuperUser: boolean | number;

  @Column({
    defaultValue: DataType.NOW
  })
  touchedAt: Date;

  @Column
  birthDate: Date;

  @Column({
    allowNull: true
  })
  dateAllowNullTrue: Date;

  @Column
  name: string;

  @Column(DataType.TEXT)
  bio: string;

  @Column
  email: string;

  @Column('VARCHAR(255)')
  city: string;

  extraField: string;
  extraField2: boolean;
  extraField3: number;

}
