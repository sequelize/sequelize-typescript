import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {IOperator} from "../interfaces/models/IOperator";
import {Provider} from "./Provider";
import {HasMany} from "../orm/annotations/HasMany";
import {DataType} from "../orm/models/DataType";

@Table
export class Branding extends Model<Branding> {

  @Column
  @PrimaryKey
  id: number;

  @Column
  timestamp: string;

  @Column
  primaryColor: string;

  @Column({
    type: DataType.BLOB,
    get: function () {
      const backgroundImage = this.getDataValue('backgroundImage');

      if (backgroundImage) {
        // convert buffer/blob data to image URL
        return this.getDataValue('backgroundImage').toString('utf8');
      }
    }
  })
  backgroundImage: string;

  @HasMany(() => Provider)
  providers: Provider[];
}
