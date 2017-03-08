import {Table, Model, DataType, Column, Length} from "../../../index";

@Table
export class Person extends Model<Person> {

  @Length({min: 1, max: 40, msg: 'wrong length'})
  @Column(DataType.TEXT)
  name: string;

}
