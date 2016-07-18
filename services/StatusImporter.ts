import Promise = require('bluebird');
import {Inject} from "di-ts";
import {DataImportHelper} from "./DataImportHelper";
import {db} from "../db";
import {Transaction} from "sequelize";
import {Status} from "../models/Status";
import {IEvseStatusRoot} from "../interfaces/soap/IEvseStatusRoot";
import {IOperatorEvseStatus} from "../interfaces/soap/IOperatorEvseStatus";
import {IEvseStatusRecord} from "../interfaces/soap/IEvseStatusRecord";
import {EVSEStatus} from "../models/EVSEStatus";
import {IEVSEStatus} from "../interfaces/IEVSEStatus";

@Inject
export class StatusImporter {

  private states;

  constructor(protected dataImportHelper: DataImportHelper) {

  }

  /**
   * Executes data import processStates, which includes filtering and mapping
   * of hbs operator data and hbs evse data. The prepared data will finally
   * stored into database.
   */
  execute(data: IEvseStatusRoot) {

    const operatorEvseStates: IOperatorEvseStatus[] = data.EvseStatuses.OperatorEvseStatus;

    return this.loadDependentData()
      .then(() => {

        return db.sequelize.transaction(transaction => {

          return this.clearStates(transaction)
            .then(() => this.retrieveEvseStatesFromOperatorEvseStates(operatorEvseStates))
            .then((evseStates) => this.mapEvseStates(evseStates))
            .then((evseStates) => db.model(EVSEStatus).bulkCreate(evseStates, {transaction}))
            ;
        })

      })
      ;
  }

  private clearStates(transaction: Transaction) {

    return db.model(EVSEStatus).destroy({transaction, where: {}});
  }

  /**
   * Loads enum data and operator data for setting relations during
   * import processStates
   */
  private loadDependentData() {

    return Promise
      .all([
        this.states || db.model(Status).findAll(),
      ])
      .spread((states) => {

        this.states = states;
      })
      ;
  }

  private retrieveEvseStatesFromOperatorEvseStates(operatorEvseStates: IOperatorEvseStatus[]) {

    let evseStates: IEvseStatusRecord[] = [];

    operatorEvseStates.forEach(operatorEvseState => {

      evseStates = evseStates.concat(this.dataImportHelper.getArrayByValue_Array(operatorEvseState.EvseStatusRecord));
    });

    return evseStates;
  }

  private mapEvseStates(evseStates: IEvseStatusRecord[]): IEVSEStatus[] {

    return evseStates.map(evseStatus => ({
      evseId: evseStatus.EvseId,
      statusId: this.dataImportHelper.getEnumIdByString(this.states, evseStatus.EvseStatus)
    }))
  }

}
