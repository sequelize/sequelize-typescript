import {expect} from 'chai';
import {version, majorVersion} from "../../../lib/utils/versioning";

/* tslint:disable:max-classes-per-file */

describe('utils', () => {

  describe('versioning', () => {

    describe('version', () => {

      it('should be a string', () => {

        expect(version).to.be.a('string');
      });
    });

    describe('majorVersion', () => {

      it('should be a number', () => {

        expect(majorVersion).to.be.a('number');
      });
    });
  });
});
