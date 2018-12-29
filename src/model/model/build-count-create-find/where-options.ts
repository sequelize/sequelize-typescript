import {WhereOptions as OriginalWhereOptions} from "sequelize";

interface OrOptions<T> {
  $or: Array<OriginalWhereOptions<T>> | OriginalWhereOptions<T>;
}

interface AndOptions<T> {
  $and: Array<OriginalWhereOptions<T>> | OriginalWhereOptions<T>;
}

export type WhereOptions<T> = OriginalWhereOptions<T> | OrOptions<T> | AndOptions<T>;
