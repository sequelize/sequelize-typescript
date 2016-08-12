import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {IOperator} from "../interfaces/models/IOperator";
import {Provider} from "./Provider";
import {HasMany} from "../orm/annotations/HasMany";

@Table
export class Branding extends Model<Branding> {

  @Column
  @PrimaryKey
  id: number;

  @Column
  primaryColor: string;
  
  @HasMany(() => Provider)
  providers: Provider[];
}
