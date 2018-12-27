import {Model, ModelType} from "../../model";

export type Repository<T extends Model<T>> = ModelType<T>;
