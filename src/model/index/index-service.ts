import 'reflect-metadata';
import {IndexesOptions as SequelizeIndexOptions} from 'sequelize';

const INDEXES_KEY = 'sequelize:indexes';

// https://github.com/sequelize/sequelize/blob/beeff96f/types/lib/query-interface.d.ts#L169
export interface IndexFieldOptions {
  name: string;
  length?: number;
  order?: 'ASC' | 'DESC';
  collate?: string;
}

export type IndexOptions = Pick<SequelizeIndexOptions, Exclude<keyof SequelizeIndexOptions, 'fields'>>;

/**
 * Returns model indexes from class by restoring this
 * information from reflect metadata
 */
export function getIndexes(target: any): any | undefined {
  const indexes = Reflect.getMetadata(INDEXES_KEY, target);

  // tslint:disable-next-line:prefer-object-spread
  return indexes && Object.assign([], indexes);
}

/**
 * Sets indexes
 */
export function setIndexes(target: any, indexes: any): void {
  Reflect.defineMetadata(INDEXES_KEY, indexes, target);
}

/**
 * Adds field to index by sequelize index and index field options,
 * and stores this information through reflect metadata. Returns index ID.
 */
export function addFieldToIndex(target: any,
                                fieldOptions: IndexFieldOptions,
                                indexOptions: IndexOptions,
                                indexId?: string | number): string | number {
  const indexes = getIndexes(target) || [];

  const chosenId = typeof indexId !== 'undefined'
    ? indexId
    : indexOptions.name || indexes.length;
  if (!indexes[chosenId]) indexes[chosenId] = {...indexOptions};

  const index = indexes[chosenId];
  if (!index.fields) index.fields = [];
  index.fields.push(fieldOptions);

  setIndexes(target, indexes);

  return chosenId;
}
