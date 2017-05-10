[![Build Status](https://travis-ci.org/RobinBuschmann/sequelize-typescript.png?branch=master)](https://travis-ci.org/RobinBuschmann/sequelize-typescript)
[![codecov](https://codecov.io/gh/RobinBuschmann/sequelize-typescript/branch/master/graph/badge.svg)](https://codecov.io/gh/RobinBuschmann/sequelize-typescript)
[![NPM](https://img.shields.io/npm/v/sequelize-typescript.svg)](https://www.npmjs.com/package/sequelize-typescript)
[![Dependency Status](https://img.shields.io/david/RobinBuschmann/sequelize-typescript.svg)](https://www.npmjs.com/package/sequelize-typescript)

# sequelize-typescript
Decorators and some other extras for sequelize (v3 + v4).

 - [Model Definition](#model-definition)
   - [`@Table` API](#table-api)
   - [`@Column` API](#column-api)
 - [Usage](#usage)
   - [Configuration](#configuration)
   - [Model-path resolving](#model-path-resolving)
 - [Model association](#model-association)
   - [One-to-many](#one-to-many)
   - [Many-to-many](#many-to-many)
   - [One-to-one](#one-to-one)
   - [`@ForeignKey`, `@BelongsTo`, `@HasMany`, `@HasOne`, `@BelongsToMany` API](#foreignkey-belongsto-hasmany-hasone-belongstomany-api)
   - [Generated getter and setter](#type-safe-usage-of-generated-getter-and-setter)
   - [Multiple relations of same models](#multiple-relations-of-same-models)
 - [Model valiation](#model-validation)
 - [Scopes](#scopes)
 - [Why `() => Model`?](#user-content-why---model)
 - [Recommendations and limitations](#recommendations-and-limitations)

### Installation
*sequelize-typescript* requires [sequelize](https://github.com/sequelize/sequelize)
```
npm install sequelize --save // v3
npm install sequelize@4.0.0-1 --save // or v4
```
and [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
```
npm install reflect-metadata --save
```
```
npm install sequelize-typescript --save 
```
Your `tsconfig.json` needs the following flags:
```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

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
The model needs to extend the `Model` class and has to be annotated with the `@Table` decorator. All properties, that
should appear as a column in the database, require the `@Column` annotation.
 
### `@Table`
The `@Table` annotation can be used without passing any parameters. To specify some more define options, use
an object literal (all [define options](http://docs.sequelizejs.com/en/v3/api/sequelize/#definemodelname-attributes-options-model) 
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
 `@Table(options: DefineOptions)`     | sets [define options](http://docs.sequelizejs.com/en/v3/api/sequelize/#definemodelname-attributes-options-model) (also sets `options.tableName=<CLASS_NAME>` and  `options.modelName=<CLASS_NAME>` if not already defined by define options) 

#### Primary key
A primary key (`id`) will be inherited from base class `Model`. This primary key is by default an `INTEGER` and has 
`autoIncrement=true` (This behaviour is a native sequelize thing). The id can easily be overridden by marking another 
attribute as primary key. So either set `@Column({primaryKey: true})` or use `@PrimaryKey` together with `@Column`.

#### `timestamps=false`
Please notice that the `timestamps` option is `false` by default. When setting `paranoid: true`,
remember to also reactivate the timestamps.

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
The `@Column` annotation can be used without passing any parameters. But therefore it is necessary, that
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
(all [attribute options](http://docs.sequelizejs.com/en/v3/api/sequelize/#definemodelname-attributes-options-model) 
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
 `@Column`                            | tries to infer [dataType](http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types) from js type
 `@Column(dataType: DateType)`        | sets [dataType](http://docs.sequelizejs.com/en/v3/docs/models-definition/#data-types) explicitly
 `@Column(options: AttributeOptions)` | sets [attribute options](http://docs.sequelizejs.com/en/v3/api/sequelize/#definemodelname-attributes-options-model)

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
 Validate annotations                 | see [Model valiation](#model-validation)

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
(See sequelize [docs](http://docs.sequelizejs.com/en/v3/docs/models-usage/))
### Configuration
To make the defined models available, you have to configure a `Sequelize` instance from `sequelize-typescript`(!). 
```typescript
import {Sequelize} from 'sequelize-typescript';

const sequelize =  new Sequelize({
        name: 'some_db',
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: ':memory:',
        modelPaths: [__dirname + '/models']
});
```
Before you can use your models, you have to tell sequelize where they can be found. So either set `modelPaths` in the 
sequlize config or add the required models later on by calling `sequelize.addModels([Person])` or 
`sequelize.addModels([__dirname + '/models'])`:

```typescript
sequelize.addModels([Person]);
sequelize.addModels(['path/to/models']);
```
#### Model-path resolving
When using a path to resolve the required models, either the class has to be exported as default or if not exported
as default, the file should have the same name as the corresponding class:
```typescript
export default class User extends Model<User> {}

// User.ts
export class User extends Model<User> {}
```
### Build and create
Instantiation and inserts can be achieved in the good old sequelize way
```typescript
const person = Person.build<Person>({name: 'bob', age: 99});
person.save();

Person.create<Person>({name: 'bob', age: 99});
```
but *sequelize-typescript* also makes it possible to create instances with `new`:
```typescript
const person = new Person({name: 'bob', age: 99});
person.save();
```

### Find and update
Finding and updating entries do also work like using native sequelize. So see sequelize 
[docs](http://docs.sequelizejs.com/en/v3/docs/models-usage/) for more details.
```typescript
Person
 .findOne<Person>()
 .then(person => {
     
     person.age = 100;
     return person.save();
 });

Person
 .update<Person>({
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
 .findOne<Team>({include: [Player]})
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

### One-to-one
For one-to-one use `@HasOne(...)`(foreign key for the relation exists on the other model) and 
`@BelongsTo(...)` (foreign key for the relation exists on this model)

### `@ForeignKey`, `@BelongsTo`, `@HasMany`, `@HasOne`, `@BelongsToMany` API

Decorator                                 | Description
------------------------------------------|---------------------
 `@ForeignKey(relatedModelGetter: () => typeof Model)` | marks property as `foreignKey` for related class 
 `@BelongsTo(relatedModelGetter: () => typeof Model)` | sets `SourceModel.belongsTo(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is resolved from source class 
 `@BelongsTo(relatedModelGetter: () => typeof Model, foreignKey: string)` | sets `SourceModel.belongsTo(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is explicitly specified value 
 `@HasMany(relatedModelGetter: () => typeof Model)` | sets `SourceModel.hasMany(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is resolved from target related class
 `@HasMany(relatedModelGetter: () => typeof Model, foreignKey: string)` | sets `SourceModel.hasMany(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is explicitly specified value
 `@HasOne(relatedModelGetter: () => typeof Model)` | sets `SourceModel.hasOne(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is resolved from target related class
 `@HasOne(relatedModelGetter: () => typeof Model, foreignKey: string)` | sets `SourceModel.hasOne(RelatedModel, ...)` while `as` is key of annotated property and `foreignKey` is explicitly specified value
 `@BelongsToMany(relatedModelGetter: () => typeof Model, through: (() => typeof Model))` | sets `SourceModel.belongsToMany(RelatedModel, {through: ThroughModel, ...})` while `as` is key of annotated property and `foreignKey`/`otherKey` is resolved from through class
 `@BelongsToMany(relatedModelGetter: () => typeof Model, through: (() => typeof Model), foreignKey: string)`| sets `SourceModel.belongsToMany(RelatedModel, {through: ThroughModel, ...})` while `as` is key of annotated property, `foreignKey` is explicitly specified value and `otherKey` is resolved from through class
 `@BelongsToMany(relatedModelGetter: () => typeof Model, through: (() => typeof Model), foreignKey: string, otherKey: string)`| sets `SourceModel.belongsToMany(RelatedModel, {through: ThroughModel, ...})` while `as` is key of annotated property and `foreignKey`/`otherKey` are explicitly specified values
 `@BelongsToMany(relatedModelGetter: () => typeof Model, through: string, foreignKey: string, otherKey: string)` | sets `SourceModel.belongsToMany(RelatedModel, {through: throughString, ...})` while `as` is key of annotated property and `foreignKey`/`otherKey` are explicitly specified values
 
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
But TypeScript will not know of them and in turn will complain, when you try to access `getModelB`, `setModelB` or 
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
To use them pass the property key of the respective relation as the first parameter:
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

## Model validation
Validation options can be set through the `@Column` annotation, but if you prefer to use separate decorators for 
validation instead, you can do so by simply adding the validate options *as* decorators:
So that `validate.isEmail=true` becomes `@IsEmail`, `validate.equals='value'` becomes `@Equals('value')` 
and so on. Please notice, that a validator, that expects a boolean, is translated to an annotation without a parameter. 

See sequelize [docs](http://docs.sequelizejs.com/en/v3/docs/models-definition/#validations) 
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
Scopes can be defined with annotations as well. The scope options are mostly the same like in native
sequelize except of the way how model classes are referenced. So instead of referencing them directly a getter
function `() => Model` is used instead. 
(See sequelize [docs](http://docs.sequelizejs.com/en/v3/docs/scopes/) for more details)

### `@DefaultScope` and `@Scopes`
```typescript
@DefaultScope({
  attributes: ['id', 'primaryColor', 'secondaryColor', 'producedAt']
})
@Scopes({
  full: {
    include: [() => Manufacturer]
  },
  yellow: {
    where: {primaryColor: 'yellow'}
  }
})
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

## Why `() => Model`?
`@ForeignKey(Model)` is much easier to read, so why is `@ForeignKey(() => Model)` so important? When it
comes to circular-dependencies (which are in general solved by node for you) `Model` can be `undefined`
when it gets passed to @ForeignKey. With the usage of a function, which returns the actual model, we prevent
this issue.

## Recommendations and limitations 
### One Sequelize instance per model 
You cannot add one and the same model to multiple Sequelize instances with
differently configured connections. So that one model will only work for one connection.
### One model class per file
This is not only good practice regarding design, but also matters for the order
of execution. Since typescript creates a `__metadata("design:type", SomeModel)` call due to `emitDecoratorMetadata` 
compile option, in some cases `SomeModel` is probably not defined(not undefined!) and would throw a `ReferenceError`.
When putting `SomeModel` in a separate file, it would look like `__metadata("design:type", SomeModel_1.SomeModel)`,
which does not throw an error.
### Minification
If you need to minify your code, you need to set `tableName` and `modelName` 
in the `DefineOptions` for `@Table` annotation. sequelize-typescript
uses the class name as default name for `tableName` and `modelName`. 
When the code is minified the class name will no longer be the originally
defined one (So that `class User` will become `class b` for example).