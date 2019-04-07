import {FindOptions} from "sequelize";

export type AssociationGetOptions = {
  scope?: string | boolean;
  schema?: string;
} & FindOptions;
