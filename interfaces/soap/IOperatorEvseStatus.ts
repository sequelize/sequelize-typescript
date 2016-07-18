import {IEvseStatusRecord} from "./IEvseStatusRecord";
export interface IOperatorEvseStatus {

  OperatorID: string;
  OperatorName: string;
  EvseStatusRecord: IEvseStatusRecord|IEvseStatusRecord[];
}
