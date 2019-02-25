import {Model} from "../model/model";

export class ModelNotInitializedError extends Error {

  message: string;

  constructor(modelClass: typeof Model, additionalMessage: string) {
    super();
    this.message = `Model not initialized: ${additionalMessage} "${modelClass.name}" ` +
      `needs to be added to a Sequelize instance.`;
  }
}
