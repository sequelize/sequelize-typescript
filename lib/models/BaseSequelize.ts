import {Model} from "./Model";
import {getModels} from "../services/models";
import {getAssociations, BELONGS_TO_MANY} from "../services/association";
import {ISequelizeConfig} from "../interfaces/ISequelizeConfig";
import {resolveScopes} from "../services/models";
import {ISequelizeValidationOnlyConfig} from "../interfaces/ISequelizeValidationOnlyConfig";
import {getForeignKey} from "../services/association";

/**
 * Why does v3/Sequlize and v4/Sequelize does not extend? Because of
 * the transpile target, which is for v3/Sequelize and BaseSequelize ES5
 * and for v4/Sequelize ES6. This is needed for extending the original
 * Sequelize (version 4), which is an ES6 class: ES5 constructor-pattern
 * "classes" cannot extend ES6 classes
 */
export abstract class BaseSequelize {

  thoughMap: {[through: string]: any} = {};
  _: {[modelName: string]: (typeof Model)} = {};

  static extend(target: any): void {

    // PROTOTYPE MEMBERS
    // --------------------------

    // copies all prototype members of this to target.prototype
    Object
      .keys(this.prototype)
      .forEach(name => target.prototype[name] = this.prototype[name])
    ;

    // STATIC MEMBERS
    // --------------------------

    // copies all static members of this to target
    Object
      .keys(this)
      .forEach(name => target[name] = this[name])
    ;
  }

  /**
   * Prepares sequelize config passed to original sequelize constructor
   */
  static prepareConfig(config: ISequelizeConfig|ISequelizeValidationOnlyConfig): ISequelizeConfig {

    if (config.validateOnly) {

      return Object.assign({}, config, {
        name: '_name_',
        username: '_username_',
        password: '_password_',
        dialect: 'sqlite',
        dialectModulePath: __dirname + '/../utils/db-dialect-dummy'
      } as ISequelizeConfig);
    }

    return config as ISequelizeConfig;
  }

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
  addModels(arg: Array<typeof Model|string>): void {

    const models = getModels(arg);

    this.defineModels(models);
    models.forEach(model => model.isInitialized = true);
    this.associateModels(models);
    resolveScopes(models);
    models.forEach(model => this._[model.name] = model);
  }

  init(config: ISequelizeConfig): void {

    if (config.modelPaths) this.addModels(config.modelPaths);
  }

  /**
   * Processes model associations
   */
  associateModels(models: Array<typeof Model>): void {

    models.forEach(model => {

      const associations = getAssociations(model.prototype);

      if (!associations) return;

      associations.forEach(association => {

        const foreignKey = association.foreignKey || getForeignKey(model, association);
        const relatedClass = association.relatedClassGetter();
        let through;
        let otherKey;

        if (association.relation === BELONGS_TO_MANY) {

          if (association.otherKey) {

            otherKey = association.otherKey;
          } else {
            if (!association.relatedClassGetter) {
              throw new Error(`RelatedClassGetter missing on "${model['name']}"`);
            }
            otherKey = getForeignKey(association.relatedClassGetter(), association);
          }

          if (association.through) {

            if (!this.thoughMap[association.through]) {
              const throughModel = this.getThroughModel(association.through);

              this.addModels([throughModel]);

              this.thoughMap[association.through] = throughModel;
            }

            through = this.thoughMap[association.through];

          } else {
            if (!association.throughClassGetter) {
              throw new Error(`ThroughClassGetter missing on "${model['name']}"`);
            }
            through = association.throughClassGetter();
          }
        }

        model[association.relation](relatedClass, {
          as: association.as,
          through,
          foreignKey,
          otherKey
        });

        // The associations has to be adjusted
        const _association = model['associations'][association.as];

        // String based through's need adjustment
        if (association.through) {

          // as and associationAccessor values referring to string "Through"
          _association.oneFromSource.as = association.through;
          _association.oneFromSource.options.as = association.through;
          _association.oneFromSource.associationAccessor = association.through;
          _association.oneFromTarget.as = association.through;
          _association.oneFromTarget.options.as = association.through;
          _association.oneFromTarget.associationAccessor = association.through;
        }

        this.adjustAssociation(model, _association);
      });
    });
  }

  /**
   * Since es6 classes cannot be extended by es5 constructor-functions the
   * "through" model needs to be created by the appropriate sequelize version
   * (sequelize v3 and v4 are transpiled with different targets (es5/es6))
   */
  abstract getThroughModel(through: string): typeof Model;

  abstract adjustAssociation(model: any, association: any): void;

  abstract defineModels(models: Array<typeof Model>): void;
}
