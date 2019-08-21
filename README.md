[![Build Status](https://travis-ci.org/RobinBuschmann/sequelize-typescript.svg?branch=master)](https://travis-ci.org/RobinBuschmann/sequelize-typescript)
[![codecov](https://codecov.io/gh/RobinBuschmann/sequelize-typescript/branch/master/graph/badge.svg)](https://codecov.io/gh/RobinBuschmann/sequelize-typescript)
[![NPM](https://img.shields.io/npm/v/sequelize-typescript.svg)](https://www.npmjs.com/package/sequelize-typescript)
[![Dependency Status](https://img.shields.io/david/RobinBuschmann/sequelize-typescript.svg)](https://www.npmjs.com/package/sequelize-typescript)

# sequelize-typescript
Decorators and some other features for sequelize (v5).

 - [Installation](#installation)
 - [Upgrade to `sequelize-typescript@1`](#upgrade-to-sequelize-typescript1)
 - [Model Definition](#model-definition)
   - [`@Table` API](#table-api)
   - [`@Column` API](#column-api)
 - [Usage](#usage)
   - [Configuration](#configuration)
   - [globs](#globs)
   - [Model-path resolving](#model-path-resolving)
 - [Model association](#model-association)
   - [One-to-many](#one-to-many)
   - [Many-to-many](#many-to-many)
   - [One-to-one](#one-to-one)
   - [`@ForeignKey`, `@BelongsTo`, `@HasMany`, `@HasOne`, `@BelongsToMany` API](#foreignkey-belongsto-hasmany-hasone-belongstomany-api)
   - [Generated getter and setter](#type-safe-usage-of-auto-generated-functions)
   - [Multiple relations of same models](#multiple-relations-of-same-models)
 - [Repository mode](#repository-mode)
   - [How to enable repository mode?](#how-to-enable-repository-mode)
   - [How to use repository mode?](#how-to-use-repository-mode)
   - [How to use associations with repository mode?](#how-to-use-associations-with-repository-mode)
   - [Limitations of repository mode](#limitations-of-repository-mode)
 - [Model validation](#model-validation)
 - [Scopes](#scopes)
 - [Hooks](#hooks)
 - [Why `() => Model`?](#user-content-why---model)
 - [Recommendations and limitations](#recommendations-and-limitations)

## Installation
*sequelize-typescript* requires [sequelize](https://github.com/sequelize/sequelize), additional typings as documented [here](http://docs.sequelizejs.com/manual/typescript.html) and [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
```
npm install sequelize
npm install @types/bluebird @types/node @types/validator
npm install reflect-metadata
```
```
npm install sequelize-typescript
```
Your `tsconfig.json` needs the following flags:
```json
"target": "es6", // or a more recent ecmascript version
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

### ⚠️ sequelize@4
`sequelize@4` requires `sequelize-typescript@0.6`. See 
[documentation](https://github.com/RobinBuschmann/sequelize-typescript/tree/0.6.X) for version `0.6`.
```
npm install sequelize-typescript@0.6
```

## Upgrade to `sequelize-typescript@1`
`sequelize-typescript@1` only works with `sequelize@5>=`. 
For `sequelize@4` & `sequelize@3` use `sequelize-typescript@0.6`.

### Breaking Changes
All breaking changes of `sequelize@5` are also valid for `sequelize-typescript@1`. 
See [Upgrade to v5](https://github.com/sequelize/sequelize/blob/master/docs/upgrade-to-v5.md) for details.

#### Official Sequelize Typings
sequelize-typescript now uses the official typings bundled with sequelize 
(See [this](https://github.com/sequelize/sequelize/blob/master/docs/upgrade-to-v5.md#typescript-support)).
Please note the following details:
- Most of the sequelize-typescript interfaces of the previous version are replaced by the official ones
- `@types/sequelize` is no longer used
- `@types/bluebird` is no longer an explicit dependency
- The official typings are less strict than the former sequelize-typescript ones

#### Sequelize Options
- `SequelizeConfig` renamed to `SequelizeOptions`
- `modelPaths` property renamed to `models`

#### Scopes Options
The `@Scopes` and `@DefaultScope` decorators now take lambda's as options
```ts
@DefaultScope(() => ({...}))
@Scopes(() => ({...}))
```
instead of deprecated way:
```ts
@DefaultScope({...})
@Scopes({...}))
```

### Repository Mode
With `sequelize-typescript@1` comes a repository mode. See [docs](#repository-mode) for details.


## Model definition
```typescript
import {Table, Column, Model, HasMany} from 'sequelize-typescript';

@Table
class Person extends Model<Person> {

  @Column
  name: string;

  @Column
  birthday: Date;

  @HasMany(() => Hobby)
  hobbies: Hobby[];
}
```
The model needs to extend the `Model` class and has to be annotated with the `@Table` decorator. All properties that
should appear as a column in the database require the `@Column` annotation.

See more advanced example [here](https://github.com/RobinBuschmann/sequelize-typescript-example).
 
### `@Table`
The `@Table` annotation can be used without passing any parameters. To specify some more define options, use
an object literal (all [define options](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#configuration) 
from sequelize are valid):
```typescript
@Table({
  timestamps: true,
  ...
})
class Person extends Model<Person> {}
```
#### Table API

Decorator                             | Description
--------------------------------------|---------------------
 `@Table`                             | sets `options.tableName=<CLASS_NAME>` and  `options.modelName=<CLASS_NAME>` automatically
 `@Table(options: DefineOptions)`     | sets [define options](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#configuration) (also sets `options.tableName=<CLASS_NAME>` and  `options.modelName=<CLASS_NAME>` if not already defined by define options) 

#### Primary key
A primary key (`id`) will be inherited from base class `Model`. This primary key is by default an `INTEGER` and has 
`autoIncrement=true` (This behaviour is a native sequelize thing). The id can easily be overridden by marking another 
attribute as primary key. So either set `@Column({primaryKey: true})` or use `@PrimaryKey` together with `@Column`.

#### `@CreatedAt`, `@UpdatedAt`, `@DeletedAt`
Annotations to define custom and type safe `createdAt`, `updatedAt` and `deletedAt` attributes:
```typescript
  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;
  
  @DeletedAt
  deletionDate: Date;
```

Decorator          | Description
-------------------|---------------------
 `@CreatedAt`      | sets `timestamps=true` and `createdAt='creationDate'`
 `@UpdatedAt`      | sets `timestamps=true` and `updatedAt='updatedOn'`
 `@DeletedAt`      | sets `timestamps=true`, `paranoid=true` and `deletedAt='deletionDate'`

### `@Column`
The `@Column` annotation can be used without passing any parameters. But therefore it is necessary that
the js type can be inferred automatically (see [Type inference](#type-inference) for details).
```typescript
  @Column
  name: string;
```
If the type cannot or should not be inferred, use:
```typescript
import {DataType} from 'sequelize-typescript';

  @Column(DataType.TEXT)
  name: string;
```
Or for a more detailed column description, use an object literal 
(all [attribute options](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#configuration) 
from sequelize are valid):
```typescript
  @Column({
    type: DataType.FLOAT,
    comment: 'Some value',
    ...
  })
  value: number;
```
#### Column API

Decorator                             | Description
--------------------------------------|---------------------
 `@Column`                            | tries to infer [dataType](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types) from js type
 `@Column(dataType: DateType)`        | sets [dataType](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types) explicitly
 `@Column(options: AttributeOptions)` | sets [attribute options](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#configuration)

#### *Shortcuts*
If you're in love with decorators: *sequelize-typescript* provides some more of them. The following decorators can be 
used together with the @Column annotation to make some attribute options easier available:

Decorator                             | Description
--------------------------------------|---------------------
 `@AllowNull(allowNull?: boolean)`    | sets `attribute.allowNull` (default is `true`)
 `@AutoIncrement`                     | sets `attribute.autoIncrement=true`
 `@Unique`                            | sets `attribute.unique=true`
 `@Default(value: any)`               | sets `attribute.defaultValue` to specified value
 `@PrimaryKey`                        | sets `attribute.primaryKey=true`
 `@Comment(value: string)`            | sets `attribute.comment` to specified string
 Validate annotations                 | see [Model validation](#model-validation)

### Type inference
The following types can be automatically inferred from javascript type. Others have to be defined explicitly.

Design type      | Sequelize data type
-----------------|---------------------
 `string`        | `STRING`
 `boolean`       | `BOOLEAN`
 `number`        | `INTEGER`
 `Date`          | `DATE`
 `Buffer`        | `BLOB`
 
### Accessors
Get/set accessors do work as well
```typescript
@Table
class Person extends Model<Person> {

  @Column
  get name(): string {
    return 'My name is ' + this.getDataValue('name');
  }
  
  set name(value: string) {
    this.setDataValue('name', value);
  }
}
```
 
## Usage
Except for minor variations *sequelize-typescript* will work like pure sequelize. 
(See sequelize [docs](http://docs.sequelizejs.com/manual/tutorial/models-usage.html))
### Configuration
To make the defined models available, you have to configure a `Sequelize` instance from `sequelize-typescript`(!). 
```typescript
import {Sequelize} from 'sequelize-typescript';

const sequelize =  new Sequelize({
        database: 'some_db',
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: ':memory:',
        models: [__dirname + '/models'], // or [Player, Team],
});
```
Before you can use your models you have to tell sequelize where they can be found. So either set `models` in the 
sequelize config or add the required models later on by calling `sequelize.addModels([Person])` or 
`sequelize.addModels([__dirname + '/models'])`:

```typescript
sequelize.addModels([Person]);
sequelize.addModels(['path/to/models']);
```
### globs
```typescript
import {Sequelize} from 'sequelize-typescript';

const sequelize =  new Sequelize({
        ...
        models: [__dirname + '/**/*.model.ts']
});
// or
sequelize.addModels([__dirname + '/**/*.model.ts']);
```

#### Model-path resolving
A model is matched to a file by its filename. E.g.
```typescript
// File User.ts matches the following exported model.
export class User extends Model<User> {}
```
This is done by comparison of the filename against all exported members. The
matching can be customized by specifying the `modelMatch` function in the
configuration object.

For example, if your models are named `user.model.ts`, and your class is called
`User`, you can match these two by using the following function:

```typescript
import {Sequelize} from 'sequelize-typescript';

const sequelize =  new Sequelize({
  models: [__dirname + '/models/**/*.model.ts']
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  },
});
```

For each file that matches the `*.model.ts` pattern, the `modelMatch` function
will be called with its exported members. E.g. for the following file

```TypeScript
//user.model.ts
import {Table, Column, Model} from 'sequelize-typescript';

export const UserN = 'Not a model';
export const NUser = 'Not a model';

@Table
export class User extends Model<User> {

  @Column
  nickname: string;
}
```

The `modelMatch` function will be called three times with the following arguments.
```
user.model UserN -> false
user.model NUser -> false
user.model User  -> true (User will be added as model)
```

Another way to match model to file is to make your model the default export.

```TypeScript
export default class User extends Model<User> {}
```

> ⚠️ When using paths to add models, keep in mind that they will be loaded during runtime. This means that the path
> may differ from development time to execution time. For instance, using `.ts` extension within paths will only work 
> together with [ts-node](https://github.com/TypeStrong/ts-node).

### Build and create
Instantiation and inserts can be achieved in the good old sequelize way
```typescript
const person = Person.build({name: 'bob', age: 99});
person.save();

Person.create({name: 'bob', age: 99});
```
but *sequelize-typescript* also makes it possible to create instances with `new`:
```typescript
const person = new Person({name: 'bob', age: 99});
person.save();
```

### Find and update
Finding and updating entries does also work like using native sequelize. So see sequelize 
[docs](http://docs.sequelizejs.com/manual/tutorial/models-usage.html) for more details.
```typescript
Person
 .findOne()
 .then(person => {
     
     person.age = 100;
     return person.save();
 });

Person
 .update({
   name: 'bobby'
 }, {where: {id: 1}})
 .then(() => {
     
 });
```

## Model association
Relations can be described directly in the model by the `@HasMany`, `@HasOne`, `@BelongsTo`, `@BelongsToMany`
and `@ForeignKey` annotations.

### One-to-many
```typescript
@Table
class Player extends Model<Player> {

  @Column
  name: string;

  @Column
  num: number;
  
  @ForeignKey(() => Team)
  @Column
  teamId: number;
  
  @BelongsTo(() => Team)
  team: Team;
}

@Table
class Team extends Model<Team> {

  @Column
  name: string;

  @HasMany(() => Player)
  players: Player[];
}
```
That's all, *sequelize-typescript* does everything else for you. So when retrieving a team by `find`
```typescript

Team
 .findOne({include: [Player]})
 .then(team => {
     
     team.players.forEach(player => console.log(`Player ${player.name}`));
 })
```
the players will also be resolved (when passing `include: Player` to the find options)

### Many-to-many
```typescript
@Table
class Book extends Model<Book> { 
  @BelongsToMany(() => Author, () => BookAuthor)
  authors: Author[];
}

@Table
class Author extends Model<Author> {

  @BelongsToMany(() => Book, () => BookAuthor)
  books: Book[];
}

@Table
class BookAuthor extends Model<BookAuthor> {

  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @ForeignKey(() => Author)
  @Column
  authorId: number;
}
```
#### Type safe *through*-table instance access
To access the *through*-table instance (instanceOf `BookAuthor` in the upper example) type safely, the type 
need to be set up manually. For `Author` model it can be achieved like so:
```ts
  @BelongsToMany(() => Book, () => BookAuthor)
  books: Array<Book & {BookAuthor: BookAuthor}>;
```

### One-to-one
For one-to-one use `@HasOne(...)`(foreign key for the relation exists on the other model) and 
`@BelongsTo(...)` (foreign key for the relation exists on this model)

### `@ForeignKey`, `@BelongsTo`, `@HasMany`, `@HasOne`, `@BelongsToMany` API

Decorator                                 | Description
------------------------------------------|---------------------
 `@ForeignKey(relatedModelGetter: () => typeof Model)` | marks property as `foreignKey` for related class 
 `@BelongsTo(relatedModelGetter: () => typeof Model)` | sets `SourceModel.belongsTo(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is resolved from source class 
 `@BelongsTo(relatedModelGetter: () => typeof Model, foreignKey: string)` | sets `SourceModel.belongsTo(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is explicitly specified value 
 `@BelongsTo(relatedModelGetter: () => typeof Model, options: AssociationOptionsBelongsTo)` | sets `SourceModel.belongsTo(RelatedModel, ...)` while `as` is key of annotated property and `options` are additional association options 
 `@HasMany(relatedModelGetter: () => typeof Model)` | sets `SourceModel.hasMany(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is resolved from target related class
 `@HasMany(relatedModelGetter: () => typeof Model, foreignKey: string)` | sets `SourceModel.hasMany(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is explicitly specified value
 `@HasMany(relatedModelGetter: () => typeof Model, options: AssociationOptionsHasMany)` | sets `SourceModel.hasMany(RelatedModel, ...)` while `as` is key of annotated property and `options` are additional association options
 `@HasOne(relatedModelGetter: () => typeof Model)` | sets `SourceModel.hasOne(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is resolved from target related class
 `@HasOne(relatedModelGetter: () => typeof Model, foreignKey: string)` | sets `SourceModel.hasOne(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is explicitly specified value
 `@HasOne(relatedModelGetter: () => typeof Model, options: AssociationOptionsHasOne)` | sets `SourceModel.hasOne(RelatedModel, ...)` while `as` is key of annotated property and `options` are additional association options
 `@BelongsToMany(relatedModelGetter: () => typeof Model, through: (() => typeof Model))` | sets `SourceModel.belongsToMany(RelatedModel, {through: ThroughModel, ...})` while `as` is key of annotated property and `foreignKey`/`otherKey` is resolved from through class
 `@BelongsToMany(relatedModelGetter: () => typeof Model, through: (() => typeof Model), foreignKey: string)`| sets `SourceModel.belongsToMany(RelatedModel, {through: ThroughModel, ...})` while `as` is key of annotated property, `foreignKey` is explicitly specified value and `otherKey` is resolved from through class
 `@BelongsToMany(relatedModelGetter: () => typeof Model, through: (() => typeof Model), foreignKey: string, otherKey: string)`| sets `SourceModel.belongsToMany(RelatedModel, {through: ThroughModel, ...})` while `as` is key of annotated property and `foreignKey`/`otherKey` are explicitly specified values
 `@BelongsToMany(relatedModelGetter: () => typeof Model, through: string, foreignKey: string, otherKey: string)` | sets `SourceModel.belongsToMany(RelatedModel, {through: throughString, ...})` while `as` is key of annotated property and `foreignKey`/`otherKey` are explicitly specified values
 `@BelongsToMany(relatedModelGetter: () => typeof Model, options: AssociationOptionsBelongsToMany)` | sets `SourceModel.belongsToMany(RelatedModel, {through: throughString, ...})` while `as` is key of annotated property and `options` are additional association values, including `foreignKey` and `otherKey`.

Note that when using AssociationOptions, certain properties will be overwritten when the association is built, based on reflection metadata or explicit attribute parameters. For example, `as` will always be the annotated property's name, and `through` will be the explicitly stated value.
 
### Multiple relations of same models
*sequelize-typescript* resolves the foreign keys by identifying the corresponding class references.
So if you define a model with multiple relations like
```typescript
@Table
class Book extends Model<Book> { 

  @ForeignKey(() => Person)
  @Column
  authorId: number;
  
  @BelongsTo(() => Person)
  author: Person; 
  
  @ForeignKey(() => Person)
  @Column
  proofreaderId: number;
  
  @BelongsTo(() => Person)
  proofreader: Person;
}

@Table
class Person extends Model<Person> {

  @HasMany(() => Book)
  writtenBooks: Book[];

  @HasMany(() => Book)
  proofedBooks: Book[];
}
```
*sequelize-typescript* cannot know which foreign key to use for which relation. So you have to add the foreign keys
explicitly:
```typescript

  // in class "Books":
  @BelongsTo(() => Person, 'authorId')
  author: Person; 

  @BelongsTo(() => Person, 'proofreaderId')
  proofreader: Person; 
  
  // in class "Person":
  @HasMany(() => Book, 'authorId')
  writtenBooks: Book[];

  @HasMany(() => Book, 'proofreaderId')
  proofedBooks: Book[];
```

### Type safe usage of auto generated functions
With the creation of a relation, sequelize generates some method on the corresponding
models. So when you create a 1:n relation between `ModelA` and `ModelB`, an instance of `ModelA` will
have the functions `getModelBs`, `setModelBs`, `addModelB`, `removeModelB`, `hasModelB`. These functions still exist with *sequelize-typescript*. 
But TypeScript wont recognize them and will complain if you try to access `getModelB`, `setModelB` or 
`addModelB`. To make TypeScript happy, the `Model.prototype` of *sequelize-typescript* has `$set`, `$get`, `$add` 
functions. 
```typescript
@Table
class ModelA extends Model<ModelA> {

  @HasMany(() => ModelB)
  bs: ModelB[];
}

@Table
class ModelB extends Model<ModelB> {

  @BelongsTo(() => ModelA)
  a: ModelA;
}
```
To use them, pass the property key of the respective relation as the first parameter:
```typescript
const modelA = new ModelA();

modelA.$set('bs', [ /* instance */]).then( /* ... */);
modelA.$add('b', /* instance */).then( /* ... */);
modelA.$get('bs').then( /* ... */);
modelA.$count('bs').then( /* ... */);
modelA.$has('bs').then( /* ... */);
modelA.$remove('bs', /* instance */ ).then( /* ... */);
modelA.$create('bs', /* value */ ).then( /* ... */);
```

## Repository mode
The repository mode makes it possible to separate static operations like `find`, `create`, ... from model definitions. 
It also empowers models so that they can be used with multiple sequelize instances.

### How to enable repository mode?
Enable repository mode by setting `repositoryMode` flag:
```typescript
const sequelize = new Sequelize({
  repositoryMode: true,
  ...,
});
```
### How to use repository mode?
Retrieve repository to create instances or perform search operations:
```typescript
const userRepository = sequelize.getRepository(User);

const luke = await userRepository.create({name: 'Luke Skywalker'});
const luke = await userRepository.findOne({where: {name: 'luke'}});
```
### How to use associations with repository mode?
For now one need to use the repositories within the include options in order to retrieve or create related data:
```typescript
const userRepository = sequelize.getRepository(User);
const addressRepository = sequelize.getRepository(Address);

userRepository.find({include: [addressRepository]});
userRepository.create({name: 'Bear'}, {include: [addressRepository]});
```
> ⚠️ This will change in the future: One will be able to refer the model classes instead of the repositories.

### Limitations of repository mode
Nested scopes and includes in general won't work when using `@Scope` annotation together with repository mode like:
```typescript
@Scopes(() => ({
  // includes
  withAddress: {
    include: [() => Address],
  },
  // nested scopes
  withAddressIncludingLatLng: {
    include: [() => Address.scope('withLatLng')],
  }
}))
@Table
class User extends Model<User> {}
```
> ⚠️ This will change in the future: Simple includes will be implemented.

## Model validation
Validation options can be set through the `@Column` annotation, but if you prefer to use separate decorators for 
validation instead, you can do so by simply adding the validate options *as* decorators:
So that `validate.isEmail=true` becomes `@IsEmail`, `validate.equals='value'` becomes `@Equals('value')` 
and so on. Please notice that a validator that expects a boolean is translated to an annotation without a parameter. 

See sequelize [docs](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations) 
for all validators.

### Exceptions
The following validators cannot simply be translated from sequelize validator to an annotation:

Validator                        | Annotation
---------------------------------|--------------------------------------------------------
 `validate.len=[number, number]` | `@Length({max?: number, min?: number})`
 `validate[customName: string]`  | For custom validators also use the `@Is(...)` annotation: Either `@Is('custom', (value) => { /* ... */})` or with named function `@Is(function custom(value) { /* ... */})`
                                 
### Example
```typescript
const HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

@Table
export class Shoe extends Model<Shoe> {

  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Equals('lala')
  @Column
  readonly key: string;

  @Contains('Special')
  @Column
  special: string;

  @Length({min: 3, max: 15})
  @Column
  brand: string;

  @IsUrl
  @Column
  brandUrl: string;

  @Is('HexColor', (value) => {
    if (!HEX_REGEX.test(value)) {
      throw new Error(`"${value}" is not a hex color value.`);
    }
  })
  @Column
  primaryColor: string;

  @Is(function hexColor(value: string): void {
    if (!HEX_REGEX.test(value)) {
      throw new Error(`"${value}" is not a hex color value.`);
    }
  })
  @Column
  secondaryColor: string;

  @Is(HEX_REGEX)
  @Column
  tertiaryColor: string;

  @IsDate
  @IsBefore('2017-02-27')
  @Column
  producedAt: Date;
}
```

## Scopes
Scopes can be defined with annotations as well. The scope options are identical to native
sequelize (See sequelize [docs](http://docs.sequelizejs.com/manual/tutorial/scopes.html) for more details)

### `@DefaultScope` and `@Scopes`
```typescript
@DefaultScope(() => ({
  attributes: ['id', 'primaryColor', 'secondaryColor', 'producedAt']
}))
@Scopes(() => ({
  full: {
    include: [Manufacturer]
  },
  yellow: {
    where: {primaryColor: 'yellow'}
  }
}))
@Table
export class ShoeWithScopes extends Model<ShoeWithScopes> {

  @Column
  readonly secretKey: string;

  @Column
  primaryColor: string;

  @Column
  secondaryColor: string;

  @Column
  producedAt: Date;

  @ForeignKey(() => Manufacturer)
  @Column
  manufacturerId: number;

  @BelongsTo(() => Manufacturer)
  manufacturer: Manufacturer;
}
```

## Hooks
Hooks can be attached to your models. All Model-level hooks are supported. See [the related unit tests](test/models/Hook.ts) for a summary.

Each hook must be a `static` method. Multiple hooks can be attached to a single method, and you can define multiple methods for a given hook.

The name of the method cannot be the same as the name of the hook (for example, a `@BeforeCreate` hook method cannot be named `beforeCreate`). That’s because Sequelize has pre-defined methods with those names.

```typescript
@Table
export class Person extends Model<Person> {
  @Column
  name: string;

  @BeforeUpdate
  @BeforeCreate
  static makeUpperCase(instance: Person) {
    // this will be called when an instance is created or updated
    instance.name = instance.name.toLocaleUpperCase();
  }

  @BeforeCreate
  static addUnicorn(instance: Person) {
    // this will also be called when an instance is created
    instance.name += ' 🦄';
  }
}
```

## Why `() => Model`?
`@ForeignKey(Model)` is much easier to read, so why is `@ForeignKey(() => Model)` so important? When it
comes to circular-dependencies (which are in general solved by node for you) `Model` can be `undefined`
when it gets passed to @ForeignKey. With the usage of a function, which returns the actual model, we prevent
this issue.

## Recommendations and limitations 

### One Sequelize instance per model (without repository mode)
Unless you are using the [repository mode](#repository-mode), you won't be able to add one and the same model to multiple 
Sequelize instances with differently configured connections. So that one model will only work for one connection.

### One model class per file
This is not only good practice regarding design, but also matters for the order
of execution. Since Typescript creates a `__metadata("design:type", SomeModel)` call due to `emitDecoratorMetadata` 
compile option, in some cases `SomeModel` is probably not defined(not undefined!) and would throw a `ReferenceError`.
When putting `SomeModel` in a separate file, it would look like `__metadata("design:type", SomeModel_1.SomeModel)`,
which does not throw an error.

### Minification
If you need to minify your code, you need to set `tableName` and `modelName` 
in the `DefineOptions` for `@Table` annotation. sequelize-typescript
uses the class name as default name for `tableName` and `modelName`. 
When the code is minified the class name will no longer be the originally
defined one (So that `class User` will become `class b` for example).


# Contributing

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
A lot of the types in `sequelize-typescript` augment, refer to, or extend what sequelize already has.
