import {Inject} from "di-ts";
import {db} from "../db";
import {UserCharging} from "../models/UserCharging";


@Inject
export class UserChargingService {

  constructor() {
  }

  getCharging(id: number, userId: number) {

    return db.model(UserCharging)
      .findOne({
        where: {id, userId}
      })
      ;
  }

  getActiveCharging(userId: number) {

    return db.model(UserCharging)
      .findOne({
        where: {userId, stoppedAt: null}
      })
      ;
  }

  getChargings(userId: number) {

    return db.model(UserCharging)
      .findAll({
        where: {userId}
      })
      ;
  }

  createCharging(userId: number, evseId: string, session: string, startedAt: string) {

    return db.model(UserCharging)
      .create({userId, evseId, session, startedAt})
      ;
  }

  updateCharging(id: number, userId: number, values: any) {

    return db.model(UserCharging)
      .update(
        values,
        {
          fields: ['stoppedAt'],
          where: {id, userId}
        }
      )
      ;
  }
}
