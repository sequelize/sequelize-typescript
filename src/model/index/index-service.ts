import 'reflect-metadata';
import { IndexesOptions as SequelizeIndexOptions } from 'sequelize';

const INDEXES_KEY = 'sequelize:indexes';

// https://github.com/sequelize/sequelize/blob/beeff96f/types/lib/query-interface.d.ts#L169
export interface IndexFieldOptions {
  name: string;
  length?: number;
  order?: `${'ASC' | 'DESC'}${ ` NULLS ${ 'FIRST' | 'LAST' }` | ''}`;
  collate?: string;
}

export interface IndexesMeta {
  named: { [name: string]: IndexOptions };
  unnamed: IndexOptions[];
}

export type IndexOptions = Pick<
  SequelizeIndexOptions,
  Exclude<keyof SequelizeIndexOptions, 'fields'>
>;

/**
 * Returns model indexes from class by restoring this
 * information from reflect metadata
 */
export function getIndexes(target: any): IndexesMeta {
  const { named = {}, unnamed = [] }: IndexesMeta = Reflect.getMetadata(INDEXES_KEY, target) || {};

  return { named: { ...named }, unnamed: [...unnamed] };
}

/**
 * Sets indexes
 */
export function setIndexes(target: any, indexes: IndexesMeta): void {
  Reflect.defineMetadata(INDEXES_KEY, indexes, target);
}

/**
 * Adds field to index by sequelize index and index field options,
 * and stores this information through reflect metadata. Returns index ID.
 */
export function addFieldToIndex(
  target: any,
  fieldOptions: IndexFieldOptions,
  indexOptions: IndexOptions,
  indexId?: string | number
): string | number {
  const indexes = getIndexes(target);

  const chosenId =
    typeof indexId !== 'undefined' ? indexId : indexOptions.name || indexes.unnamed.length;
  const indexStore = typeof chosenId === 'string' ? indexes.named : indexes.unnamed;
  if (!indexStore[chosenId]) indexStore[chosenId] = { ...indexOptions };

  const index = indexStore[chosenId];
  if (!index.fields) index.fields = [];
  index.fields.push(fieldOptions);

  setIndexes(target, indexes);

  return chosenId;
}
