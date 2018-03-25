import {ModelClassGetter} from '../../model/types/ModelClassGetter';

/**
 * Association Object for Include Options
 */
export interface IScopeIncludeAssociation {
  source: ModelClassGetter;
  target: ModelClassGetter;
  identifier: string;
}
