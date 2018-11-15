import {WhereOptions} from "sequelize";

interface IOrOptions<T> {
  $or: Array<WhereOptions<T>> | WhereOptions<T>;
}

interface IAndOptions<T> {
  $and: Array<WhereOptions<T>> | WhereOptions<T>;
}

export type IWhereOptions<T> = WhereOptions<T> | IOrOptions<T> | IAndOptions<T>;
