import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {Branding} from "./Branding";
import {BelongsTo} from "../orm/annotations/BelongsTo";

@Table
export class Provider extends Model<Provider> {

  @Column
  @PrimaryKey
  id: string;

  @Column
  @ForeignKey(() => Branding)
  activeBrandingId: number;

  @BelongsTo(() => Branding)
  branding: Branding;
}
