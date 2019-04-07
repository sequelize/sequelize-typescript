import {FindOptions} from "sequelize";

export type AssociationCountOptions = {
  scope?: string | boolean;
} & FindOptions;
