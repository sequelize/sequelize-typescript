import {Table, Model, Column} from "../../index";

@Table({
  timestamps: true,
  updatedAt: false
})
export class UserWithCreatedAtButWithoutUpdatedAt extends Model<UserWithCreatedAtButWithoutUpdatedAt> {

  @Column
  name: string;
}
