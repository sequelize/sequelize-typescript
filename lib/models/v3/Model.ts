import {IDummyConstructor} from "../../interfaces/IDummyConstructor";
import {Instance, Model as SeqModel} from 'sequelize';

const SeqInstance: IDummyConstructor = (Instance as any);
const SeqModelProto = (SeqModel as any).prototype;

// work around for fixing issue while model definition;
// 'length' get called on instances dataValues (which
// is undefined during this process) by lodash, which
// results in weird behaviour
SeqInstance.prototype.dataValues = {};

/**
 * Sequelize model for sequelize versions less than v4
 */
export const Model: any = (() => {

  const _Model = class extends SeqInstance {

    constructor(values: any,
                options?: any) {
      super(values, options ||
        {isNewRecord: true}); // when called with "new"
    }
  };

  // Create proxies for static model, to forward any
  // static function calls to the "real" sequelize model,
  // which is referred in the property "Model";
  // e.g. "build" and "create"
  Object
    .keys(SeqModelProto)
    .forEach(key => {
      if (typeof SeqModelProto[key] === 'function') {

        _Model[key] = function(...args: any[]): any {
          return SeqModelProto[key].call(this.Model || this, ...args);
        };
      }
    });

  return _Model;
})();
