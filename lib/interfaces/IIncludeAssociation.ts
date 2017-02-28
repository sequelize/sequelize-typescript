import {Model} from "../models/Model";

/**
 * Association Object for Include Options
 */
export interface IIncludeAssociation {
  source: typeof Model;
  target: typeof Model;
  identifier: string;
}
