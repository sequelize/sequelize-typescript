import {Inject} from "di-ts";
import {config} from "../config";
import {DataImporter} from "./DataImporter";
import {StatusImporter} from "./StatusImporter";
import {SoapService} from "./SoapService";
import {logger} from "../logger";
const CronJob = require('cron').CronJob;

/**
 * This cron service implements specific jobs for data imports
 */
@Inject
export class CronService {

  constructor(protected dataImporter: DataImporter,
              protected statusImporter: StatusImporter,
              protected soapService: SoapService) {

  }

  /**
   * Schedules evse data import specified by configured time period
   */
  scheduleEvseDataImport() {

    new CronJob(
      config.cronjob.evseData.tab,
      () => {

        logger.info('Starts EVSE data import job');

        this.soapService.eRoamingPullEvseData()
          .then(data => this.dataImporter.execute(data))
          .catch(err => logger.error(err))
        ;
      },
      () => null, // This function is executed when the job stops
      config.cronjob.evseData.run // start job automatically
    );

    if(config.cronjob.evseData.run) logger.info('EVSE data import job scheduled');
  }

  /**
   * Schedules evse status import specified by configured time period
   */
  scheduleEvseStatusImport() {

    new CronJob(
      config.cronjob.evseStatus.tab,
      () => {

        logger.info('Starts EVSE status import job');

        this.soapService.eRoamingPullEvseStatus()
          .then(data => this.statusImporter.execute(data))
          .catch(err => logger.error(err))
        ;
      },
      () => null, // This function is executed when the job stops
      config.cronjob.evseStatus.run // start job automatically
    );

    if(config.cronjob.evseStatus.run) logger.info('EVSE status import job scheduled');
  }
}
