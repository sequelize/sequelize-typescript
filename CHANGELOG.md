

## [2.1.6](https://github.com/RobinBuschmann/sequelize-typescript/compare/v2.1.5...v2.1.6) (2023-11-24)


### Bug Fixes

* deny modifying the object prototype ([#1698](https://github.com/RobinBuschmann/sequelize-typescript/issues/1698)) ([5ce8afd](https://github.com/RobinBuschmann/sequelize-typescript/commit/5ce8afdd1671b08c774ce106b000605ba8fccf78))

# Changelog

## [2.1.5](https://github.com/RobinBuschmann/sequelize-typescript/compare/v2.1.4...v2.1.5) (2022-10-17)

### Bug Fixes

- **deps:** revert to glob@7.2.0 for sequelize@6 & node@10 compatibility ([#1479](https://github.com/RobinBuschmann/sequelize-typescript/issues/1479)) ([7c8eea7](https://github.com/RobinBuschmann/sequelize-typescript/commit/7c8eea7bb7f9de5fdb03fef56afb0654808a0d18))

## [2.1.4](https://github.com/RobinBuschmann/sequelize-typescript/compare/v2.1.3...v2.1.4) (2022-10-15)

### Bug Fixes

- **ci:** bump markdownlint ([#1470](https://github.com/RobinBuschmann/sequelize-typescript/issues/1470)) ([b24869b](https://github.com/RobinBuschmann/sequelize-typescript/commit/b24869bc770289c37b9b74f43630aa63eab706b4))
- **model:** compatible constructor with sequelize ([#1310](https://github.com/RobinBuschmann/sequelize-typescript/issues/1310)) ([4f03520](https://github.com/RobinBuschmann/sequelize-typescript/commit/4f03520c4c3076a3d7c6ed6fc4ed76f1c06f9ef7))
- update to TypeScript 4.8 ([#1453](https://github.com/RobinBuschmann/sequelize-typescript/issues/1453)) ([5ddfa61](https://github.com/RobinBuschmann/sequelize-typescript/commit/5ddfa612de51750f0f81e1d8c7e4fc2d03824713))

## [2.1.3](https://github.com/RobinBuschmann/sequelize-typescript/compare/v2.1.2...v2.1.3) (2022-02-16)

### Bug Fixes

- Fix sequelize/types/lib/hooks path ([#1202](https://github.com/RobinBuschmann/sequelize-typescript/issues/1198)) ([ab45c14](https://github.com/RobinBuschmann/sequelize-typescript/commit/ab45c14da8cbd388f7611c0703e1f198e1f4541b))

## [2.1.2](https://github.com/RobinBuschmann/sequelize-typescript/compare/v2.1.1...v2.1.2) (2022-01-03)

### Bug Fixes

- use custom decorator on column have a property descriptor ([#1070](https://github.com/RobinBuschmann/sequelize-typescript/issues/1070)) ([7ce03de](https://github.com/RobinBuschmann/sequelize-typescript/commit/7ce03de76b465172994f41a55058ea49f3ce27c3))
- **validators:** allow any values for isIn/notIn ([#1124](https://github.com/RobinBuschmann/sequelize-typescript/issues/1124)) ([d25b392](https://github.com/RobinBuschmann/sequelize-typescript/commit/d25b39282d2a49e4e5cf286100344e7d1fda3c84))

## [2.1.1](https://github.com/RobinBuschmann/sequelize-typescript/compare/v2.1.0...v2.1.1) (2021-10-10)

### Bug Fixes

- **model:** adjust init method to recently introduced sequelize type changes ([b60c011](https://github.com/RobinBuschmann/sequelize-typescript/commit/b60c011be2e971e56cb783d4ade994965faab916))

## [2.1.0](https://github.com/RobinBuschmann/sequelize-typescript/compare/v2.0.0-beta.1...v2.1.0) (2021-02-14)

Initial release with Changelog.

### Bug Fixes

- allow $set null (remove association) ([#774](https://github.com/RobinBuschmann/sequelize-typescript/issues/774)) ([ffe1c78](https://github.com/RobinBuschmann/sequelize-typescript/commit/ffe1c78df73df7f287b8ce345d6ac0df30283723))
- model associations methods to reflect sequelize v6 ([#888](https://github.com/RobinBuschmann/sequelize-typescript/issues/888)) ([6b1e3ff](https://github.com/RobinBuschmann/sequelize-typescript/commit/6b1e3fffd974f087be2e18258306f81860923ba3))
- typeof Model errors by using typeof Model generics ([#900](https://github.com/RobinBuschmann/sequelize-typescript/issues/900)) ([b865840](https://github.com/RobinBuschmann/sequelize-typescript/commit/b8658404f12e7a44893c9b8652714473bb25f495))

### Features

- infer bigint data type ([#893](https://github.com/RobinBuschmann/sequelize-typescript/issues/893)) ([7c467d4](https://github.com/RobinBuschmann/sequelize-typescript/commit/7c467d404a200b3153cc7aa2605d1e542bef3da9))

## Older versions

### ⚠️ sequelize@5

`sequelize@5` requires `sequelize-typescript@1`. See
[documentation](https://github.com/RobinBuschmann/sequelize-typescript/tree/1.0.0) for version `1.0`.

```sh
npm install sequelize-typescript@1.0
```

#### V5 Model definition

```typescript
import { Table, Model } from 'sequelize-typescript';

@Table
class Person extends Model<Person> {}
```

### ⚠️ sequelize@4

`sequelize@4` requires `sequelize-typescript@0.6`. See
[documentation](https://github.com/RobinBuschmann/sequelize-typescript/tree/0.6.X) for version `0.6`.

```sh
npm install sequelize-typescript@0.6
```

### Upgrade to `sequelize-typescript@2`

- `sequelize-typescript@2` only works with `sequelize@6.2>=`.
  For `sequelize@5` use `sequelize-typescript@1.0`.

#### Breaking Changes

- All breaking changes of `sequelize@6` are also valid for `sequelize-typescript@2`.
  See [Upgrade to v6](https://sequelize.org/master/manual/upgrade-to-v6.html) for details.
- `@types/bluebird` is no longer needed, `sequelize@6` removed usage of `bluebird`
- Sequelize v6.2 introduced additional model attributes typings, which affects how the model is defined.
- See below comparison between V5 and V6 model definition to show how to upgrade models.
- For more details, see [sequelize typescript docs](https://sequelize.org/master/manual/typescript.html).

### Upgrade to `sequelize-typescript@1`

`sequelize-typescript@1` only works with `sequelize@5>=`.
For `sequelize@4` & `sequelize@3` use `sequelize-typescript@0.6`.

#### Breaking Changes @5

All breaking changes of `sequelize@5` are also valid for `sequelize-typescript@1`.
See [Upgrade to v5](https://sequelize.org/v5/manual/upgrade-to-v5.html) for details.

#### Official Sequelize Typings

sequelize-typescript now uses the official typings bundled with sequelize
(See [this](https://sequelize.org/v5/manual/upgrade-to-v5.html#typescript-support)).
Please note the following details:

- Most of the sequelize-typescript interfaces of the previous version are replaced by the official ones
- `@types/sequelize` is no longer used
- `@types/bluebird` is no longer an explicit dependency
- The official typings are less strict than the former sequelize-typescript ones