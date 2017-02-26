import {Table, Model, Column} from "../../index";

@Table
export class UserWithCustomUpdatedAt extends Model<UserWithCustomUpdatedAt> {

  @Column
  name: string;

  @Column
  updatedAt: Date;

}
