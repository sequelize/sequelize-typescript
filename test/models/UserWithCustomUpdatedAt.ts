import {Table, Model, Column} from "../../src";

@Table({timestamps: false})
export class UserWithCustomUpdatedAt extends Model<UserWithCustomUpdatedAt> {

  @Column
  name: string;

  @Column
  updatedAt: Date;

}
