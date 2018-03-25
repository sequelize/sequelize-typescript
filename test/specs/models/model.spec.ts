import {expect} from 'chai';
import {Model} from "../../../lib/model/models/Model";

describe('model', () => {

  describe('constructor', () => {

    it('should equal Model class', () => {
      expect(Model.prototype.constructor).to.equal(Model);
    });

  });

});
