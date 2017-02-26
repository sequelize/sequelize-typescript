import {Table, Model, Column, DataType} from "../../index";

@Table
export class UserWithSwag extends Model<UserWithSwag> {

  @Column
  name: string;

  @Column({
    type: DataType.VIRTUAL,
    get(): string {
      return 'swag';
    }
  })
  bio: string;

  @Column({
    validate: {
      isEmail: true
    }
  })
  email: string;

}
