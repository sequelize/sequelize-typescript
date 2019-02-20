import {ModelClassGetter} from "../../model/shared/model-class-getter";

export interface ForeignKeyMeta {

  relatedClassGetter: ModelClassGetter;
  foreignKey: string;
}
