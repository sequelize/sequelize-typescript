import {expect, use} from 'chai';
import {readFileSync, readdirSync, statSync} from 'fs';
import * as chaiAsPromised from 'chai-as-promised';
import {containsEs6Syntax} from "../utils/common";

use(chaiAsPromised);

describe('transpiled code', () => {

  const es6FileSubPaths = [
    'v4/Model.js',
    'v4/Sequelize.js',
  ];

  (function run(path: string): void {

    readdirSync(path)
      .forEach(name => {

        const targetPath = path + '/' + name;

        if (statSync(targetPath).isDirectory()) {

          run(targetPath);
        } else if (name.slice(-3) === '.js') {

          const parentDir = path.split('/').pop();
          const target = parentDir + '/' + name;
          const isEs6 = es6FileSubPaths.indexOf(target) !== -1;

          describe(target, () => {

            it(`should ${isEs6 ? '' : 'NOT '}contain es6 syntax`, () => {

              const content = readFileSync(targetPath).toString();

              try {

                expect(containsEs6Syntax(content)).to.be[isEs6.toString()];
              } catch (e) {

                e.message = e.message + '\n\n\nAffected content:\n\n' + content + '\n\n\n';

                throw e;
              }
            });
          });
        }
      });

  })(__dirname + '/../../lib');

});
