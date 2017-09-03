import 'reflect-metadata';
import * as SequelizeOrigin from 'sequelize';
import {Model} from "../Model";
import {SequelizeConfig} from "../../types/SequelizeConfig";
import {getModelName, getAttributes, getOptions} from "../../services/models";
import {PROPERTY_LINK_TO_ORIG} from "../../services/models";
import {BaseSequelize} from "../BaseSequelize";
import {Table} from "../../annotations/Table";
import {ISequelizeAssociation} from "../../interfaces/ISequelizeAssociation";

export class Sequelize extends SequelizeOrigin implements BaseSequelize {

  // to fix "$1" called with something that's not an instance of Sequelize.Model
  Model: any;

  throughMap: { [through: string]: any };
  _: { [modelName: string]: typeof Model };
  init: (config: SequelizeConfig) => void;
  addModels: (models: Array<typeof Model> | string[]) => void;
  associateModels: (models: Array<typeof Model>) => void;

  constructor(config: SequelizeConfig | string) {
    if (typeof config === "string") {
      super(config);
    } else if (BaseSequelize.isISequelizeUriConfig(config)) {
      super(config.url, config);
    } else {
      super(BaseSequelize.prepareConfig(config));
    }

    this.throughMap = {};
    this._ = {};
    this.Model = Function;

    if (typeof config !== "string") {
      this.init(config);
    }
  }

  getThroughModel(through: string): typeof Model {

    // tslint:disable:max-classes-per-file
    @Table({tableName: through, modelName: through})
    class Through extends Model<Through> {
    }

    return Through;
  }

  /**
   * The association needs to be adjusted. So that throughModel properties
   * referencing a original sequelize Model instance
   */
  adjustAssociation(model: any, association: ISequelizeAssociation): void {

    // The associations has to be adjusted
    const internalAssociation = model['associations'][association.as];

    // String based through's need adjustment
    if (internalAssociation.oneFromSource &&
      internalAssociation.oneFromSource.as === 'Through') {
      // as and associationAccessor values referring to string "Through"
      internalAssociation.oneFromSource.as = association.through;
      internalAssociation.oneFromSource.options.as = association.through;
      internalAssociation.oneFromSource.associationAccessor = association.through;
      internalAssociation.oneFromTarget.as = association.through;
      internalAssociation.oneFromTarget.options.as = association.through;
      internalAssociation.oneFromTarget.associationAccessor = association.through;
    }

    if (internalAssociation.throughModel && internalAssociation.throughModel.Model) {
      const seqThroughModel = internalAssociation.throughModel.Model;
      const throughModel = internalAssociation.throughModel;

      Object.keys(seqThroughModel).forEach(key => {
        if (key !== 'name') throughModel[key] = seqThroughModel[key];
      });

      internalAssociation.throughModel = internalAssociation.through.model = internalAssociation.throughModel.Model;
    }
  }

  /**
   * Creates sequelize models and registers these models
   * in the registry
   */
  defineModels(classes: Array<typeof Model>): void {

    classes.forEach(_class => {

      const modelName = getModelName(_class.prototype);
      const attributes = getAttributes(_class.prototype);
      const options = getOptions(_class.prototype);

      if (!options) throw new Error(`@Table annotation is missing on class "${_class['name']}"`);

      const model = this.define(modelName, attributes, options);

      // replace Instance model with the original model
      (model as any).Instance = _class;
      (model as any).Instance.prototype.Model = _class;
      (model as any).Instance.prototype.$Model = _class;
      // this initializes some stuff for Instance
      model['refreshAttributes']();

      // copy own static fields to class
      Object.keys(model).forEach(key => key !== 'name' && (_class[key] = model[key]));

      // the class needs to know its sequelize model
      _class['Model'] = model;
      (_class as any).prototype['Model'] = _class.prototype['$Model'] = model;

      // model needs to know its original class
      (model as any)[PROPERTY_LINK_TO_ORIG] = _class;

      // to fix "$1" called with something that's not an instance of Sequelize.Model
      _class['sequelize'] = this;
    });
  }
}
