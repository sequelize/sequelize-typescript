import {Inject} from "di-ts";
import {db} from "../db";
import {Log} from "../models/Log";

@Inject
export class LogService {

  log(userId: number, appVersion: string, appUrl: string, message: string, cause: string) {

    return db.model(Log)
      .create({
        userId,
        appVersion,
        appUrl,
        message,
        cause
      })
  }

}
