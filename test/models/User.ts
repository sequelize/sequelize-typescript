import {Table, Model, PrimaryKey, Column, AutoIncrement, DataType, Default, AllowNull} from "../../index";

@Table
export class User extends Model<User> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1
  })
  uuidv1: string;

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  uuidv4: string;

  @Column
  username: string;

  @Column(DataType.STRING(5))
  username2: string;

  @Column
  aNumber: number;

  @Column
  bNumber: number;

  @Column
  isAdmin: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isSuperUser: boolean|number;

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

  extraField: string;
  extraField2: boolean;
  extraField3: number;

}
