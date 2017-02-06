import {Table, Model, PrimaryKey, Column, AutoIncrement} from "../../index";

@Table
export class User extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

}
