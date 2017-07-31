To contribute you can:
- Open issues and participate in discussion of other issues.
- Fork the project to open up PR's.
- Update the [types of Sequelize](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/sequelize).
- Anything else constructively helpful.

In order to open a pull request please:
- Create a new branch.
- Run tests locally (`npm install && npm run build && npm run cover`) and ensure your commits don't break the tests.
- Document your work well with commit messages, a good PR description, comments in code when necessary, etc.

In order to update the types for sequelize please go to [the Definitely Typed repo](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/sequelize), it would also be a good
idea to open a PR into [sequelize](https://github.com/sequelize/sequelize) so that Sequelize can maintain its own types, but that
might be harder than getting updated types into microsoft's repo. The Typescript team is slowly trying to encourage
npm package maintainers to maintain their own typings, but Microsoft still has dedicated and good people maintaining the DT repo, 
accepting PR's and keeping quality high.

**Keep in mind `sequelize-typescript` does not provide typings for `sequelize`** - these are seperate things.
A lot of the types in `sequelize-typescript` augment, refer to, or extends what sequelize already has.
