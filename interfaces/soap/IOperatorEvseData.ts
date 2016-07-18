import {IEvseDataRecord} from "./IEvseDataRecord";

export interface IOperatorEvseData {
  
  OperatorID: string;
  OperatorName: string;
  EvseDataRecord: IEvseDataRecord|IEvseDataRecord[];
}
