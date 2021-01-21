import {Table, Model, Column, PrimaryKey, DataType, Default} from "../../src";

@Table
export class Person extends Model {

  @PrimaryKey
  @Default(DataType.UUIDV1)
  @Column(DataType.UUID)
  id: string;

  @Column
  name: string;
}
