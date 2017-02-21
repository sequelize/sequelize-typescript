import {Table, Model, PrimaryKey, Column, AutoIncrement, DataType} from "../../index";

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

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  uuidv4: string;

  @Column
  username: string;

  @Column
  aNumber: number;

  @Column
  bNumber: number;

  @Column
  isSuperUser: boolean;

  @Column({
    defaultValue: DataType.NOW
  })
  touchedAt: Date;

  @Column({
    allowNull: true
  })
  dateAllowNullTrue: Date;

  @Column
  name: string;

  @Column({
    type: DataType.TEXT
  })
  bio: string;

  @Column
  email: string;

}
