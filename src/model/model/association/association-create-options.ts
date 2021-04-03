import { CreateOptions } from 'sequelize';

export type AssociationCreateOptions = {
  through?: any;
} & CreateOptions;
