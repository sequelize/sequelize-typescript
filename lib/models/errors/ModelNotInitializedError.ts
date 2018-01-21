import {Error} from 'sequelize';
import {Model} from '../Model';

export class ModelNotInitializedError extends Error {

  constructor(modelClass: typeof Model,
              {accessedPropertyKey, cause}: {
                accessedPropertyKey?: string,
                cause?: string
              }) {
    super();
    if (!cause) {
      if (accessedPropertyKey) {
        cause = `before "${accessedPropertyKey}" can be called.`;
      } else {
        cause = 'before it can be used.';
      }
    }
    this.message = `Model not initialized: "${modelClass.name}" ` +
      `needs to be added to a Sequelize instance ${cause}`;
  }
}
