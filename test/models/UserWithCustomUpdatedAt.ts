import {Table, Model, Column} from "../../src";

@Table
export class UserWithCustomUpdatedAt extends Model<UserWithCustomUpdatedAt> {

  @Column
  name: string;

  @Column
  updatedAt: Date;

}
