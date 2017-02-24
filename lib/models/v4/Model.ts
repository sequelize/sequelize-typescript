import {Model as SeqModel} from 'sequelize';
import {IDummyConstructor} from "../../interfaces/IDummyConstructor";

export const _SeqModel: IDummyConstructor = (SeqModel as any);

export class Model extends _SeqModel {}
