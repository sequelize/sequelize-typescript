import {Model} from "../../model/model/model";
import {ModelType} from "../../model/model/model-type";

export type Repository<T extends Model<T>> = ModelType<T>;
