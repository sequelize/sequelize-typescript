import {Table, Model, Column, PrimaryKey, DataType, Default} from "../../index";

@Table
export class Person extends Model<Person> {

  @PrimaryKey
  @Default(DataType.UUIDV1)
  @Column(DataType.UUID)
  id: string;
}
