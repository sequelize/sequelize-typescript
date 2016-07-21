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
import {IEVSEStatus} from "../interfaces/models/IEVSEStatus";
import {logger} from "../logger";
import {EventEmitter} from "events";

const IMPORT_SUCCEEDED_EVENT = 'import_succeeded';

@Inject
export class StatusImporter extends EventEmitter {

  private states;

  constructor(protected dataImportHelper: DataImportHelper) {

    super();
  }

  /**
   * Executes data import process, which includes filtering and mapping
   * of HBS operator data and hbs EVSE data. The prepared data will finally
   * stored into database.
   */
  execute(data: IEvseStatusRoot) {

    logger.info('Starts EvseStatus import process');

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
      .then(() => {
        
        this.emit(IMPORT_SUCCEEDED_EVENT);
        logger.info('EvseStatus import successfully processed')
      })
      ;
  }

  /**
   * Registers an event listener, which will be called when import is succeeded
   */
  onImportSucceeded(listener: Function) {
    
    this.on(IMPORT_SUCCEEDED_EVENT, listener);
  }

  /**
   * Removes all states of EVSE data from database
   */
  private clearStates(transaction: Transaction) {

    return db.model(EVSEStatus).destroy({transaction, where: {}});
  }

  /**
   * Loads enum data for setting relations during import process
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

  /**
   * Retrieves EVSE states from operator EVSE data
   */
  private retrieveEvseStatesFromOperatorEvseStates(operatorEvseStates: IOperatorEvseStatus[]) {

    let evseStates: IEvseStatusRecord[] = [];

    operatorEvseStates.forEach(operatorEvseState => {

      evseStates = evseStates.concat(this.dataImportHelper.getArrayByValue_Array(operatorEvseState.EvseStatusRecord));
    });

    logger.info(`Evse status data retrieved from operator evse states (Count: ${evseStates.length})`);

    return evseStates;
  }

  /**
   * Maps EVSE states from soap call to db data schema
   */
  private mapEvseStates(evseStates: IEvseStatusRecord[]): IEVSEStatus[] {

    return evseStates.map(evseStatus => ({
      evseId: evseStatus.EvseId,
      statusId: this.dataImportHelper.getEnumIdByString(this.states, evseStatus.EvseStatus)
    }))
  }

}
