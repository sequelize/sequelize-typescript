import {Table} from "../orm/annotations/Table";
import {Column} from "../orm/annotations/Column";
import {Model} from "../orm/models/Model";
import {PrimaryKey} from "../orm/annotations/PrimaryKey";
import {ForeignKey} from "../orm/annotations/ForeignKey";
import {IOperator} from "../interfaces/models/IOperator";
import {BelongsTo} from "../orm/annotations/BelongsTo";
import {DataType} from "../orm/models/DataType";
import {OperatorInterchargeDirect} from "./OperatorInterchargeDirect";
import {HasOne} from "../orm/annotations/HasOne";

@Table
export class Operator extends Model<Operator> implements IOperator {

  @Column
  @PrimaryKey
  id: string;

  @Column({
    type: DataType.STRING,
    get() {
      let name = this.getDataValue('name');

      if (!name) {
        let parent = this.getDataValue('parent');

        if (parent) {
          return parent.name;
        }
      }
      return name;
    }
  })
  name: string;

  @Column
  @ForeignKey(() => Operator)
  parentId: string;

  @BelongsTo(() => Operator)
  parent: Operator;

  @HasOne(() => OperatorInterchargeDirect)
  interchargeDirect: OperatorInterchargeDirect;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      let interchargeDirect = this.getDataValue('interchargeDirect');

      if(interchargeDirect === void 0) {

        let parent = this.getDataValue('parent');

        if(parent) {

          interchargeDirect = parent.interchargeDirect;
          delete parent.dataValues.interchargeDirect;
        }
      }

      delete this.dataValues.interchargeDirect;

      return !!interchargeDirect;
    }
  })
  hasInterchargeDirect: boolean;

}
