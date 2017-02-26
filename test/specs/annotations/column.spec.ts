import {expect} from 'chai';
import {createSequelize} from "../../utils/sequelize";
import {User} from "../../models/User";
import {DataType} from "../../../lib/enums/DataType";

describe('column', () => {

  const sequelize = createSequelize();

  beforeEach(() => sequelize.sync({force: true}));

  describe('rawAttributes', () => {

    const rawAttributes = User['rawAttributes'];

    it('should find specified attributes in rawAttributes', () => {

      expect(rawAttributes).to.have.property('id');
      expect(rawAttributes).to.have.property('uuidv1');
      expect(rawAttributes).to.have.property('uuidv4');
      expect(rawAttributes).to.have.property('username');
      expect(rawAttributes).to.have.property('aNumber');
      expect(rawAttributes).to.have.property('bNumber');
      expect(rawAttributes).to.have.property('isAdmin');
      expect(rawAttributes).to.have.property('isSuperUser');
      expect(rawAttributes).to.have.property('touchedAt');
      expect(rawAttributes).to.have.property('birthDate');
      expect(rawAttributes).to.have.property('dateAllowNullTrue');
      expect(rawAttributes).to.have.property('name');
      expect(rawAttributes).to.have.property('bio');
      expect(rawAttributes).to.have.property('email');
    });

    it('should not find unspecified attributes in rawAttributes', () => {

      expect(rawAttributes).not.to.have.property('extraField');
      expect(rawAttributes).not.to.have.property('extraField2');
      expect(rawAttributes).not.to.have.property('extraField3');
    });

    it('should pass attribute options to rawAttributes', () => {

      const uidv1SeqRawAttrOptions = rawAttributes.uuidv1;

      expect(uidv1SeqRawAttrOptions).to.have.property('type');
      expect(uidv1SeqRawAttrOptions.type).to.be.an.instanceOf(DataType.UUID);
      expect(uidv1SeqRawAttrOptions).to.have.property('defaultValue');
      expect(uidv1SeqRawAttrOptions.defaultValue).to.be.an.instanceof(DataType.UUIDV1);

      const uidv4SeqRawAttrOptions = rawAttributes.uuidv4;

      expect(uidv4SeqRawAttrOptions).to.have.property('type');
      expect(uidv4SeqRawAttrOptions.type).to.be.an.instanceOf(DataType.UUID);
      expect(uidv4SeqRawAttrOptions).to.have.property('defaultValue');
      expect(uidv4SeqRawAttrOptions.defaultValue).to.be.an.instanceof(DataType.UUIDV4);
    });

    // it('should infer correct types', () => {
    //
    //   rawAttributes.to.ha
    // });

  });

});
