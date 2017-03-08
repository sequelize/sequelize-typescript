# sequelize-typescript
Decorators and some other extras for sequelize (v3 + v4).

 - [Model Definition](#model-definition)
 - [Usage](#usage)
 - [Model association](#model-association)
   - [One-to-many](#one-to-many)
   - [Many-to-many](#many-to-many)
   - [One-to-one](#one-to-one)
   - [Generated getter and setter](#type-safe-usage-of-generated-getter-and-setter)
 - [Model valiation](#model-validation)
 - [Scopes](#scopes)
 - [Why `() => Model`?](#user-content-why---model)

### Installation
*sequelize-typescript* requires [sequelize](https://github.com/sequelize/sequelize):
```
npm install sequelize --save // v3
npm install sequelize@4.0.0-1 --save // or v4
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
import {Table, Column, Model} from 'sequelize-typescript';

@Table
class Person extends Model<Person> {

  @Column
  name: string;

  @Column
  age: number;
}
```
The model need to extend the `Model` class and has to be annotated with the `@Table` decorator. All properties, that
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
#### `timestamps=false`
Please notice, that the `timestamps` option is `false` by default. So when setting `paranoid: true`,
remember to also reactivate the timestamps.

### `@Column`
The `@Column` annotation can be used without passing any parameters. But therefor it is necessary, that
the design-type can be inferred automatically (see [Type inference](#type-inference) for details).
```typescript
  @Column
  name: string;
```
If the type cannot be or should not be inferred, use:
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
#### *Shortcuts*
If you're in love with decorators: *sequelize-typescript* provides some more of them, which can be used together with 
the @Column annotation, to make some attribute options easier available:

Decorator                             | Description
--------------------------------------|---------------------
 `@AllowNull(allowNull?: boolean)`    | sets `attribute.allowNull` (default is `true`)
 `@AutoIncrement`                     | `attribute.autoIncrement=true`
 `@Default(value: any)`               | sets `attribute.defaultValue` to specified value
 `@PrimaryKey`                        | `attribute.primaryKey=true`
 Validate annotations                 | see [Model valiation](#model-validation)

### Type inference
The following types can be automatically inferred from design-type others have to be defined explicitly.

Design type      | Sequelize data type
-----------------|---------------------
 `string`        | `STRING`
 `boolean`       | `BOOLEAN`
 `number`        | `INTEGER`
 `Date`          | `DATE`
 `Buffer`        | `BLOB`
 
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
        modelPaths: [__dirname + '/models'] // here
});

sequelize.addModels([Person]); // and/or here
```
Before you can use your models, you have to tell sequelize, where they can be found. So either `modelPath` can be set
in the sequlize config or the required models can be added later on by calling
`sequelize.addModels([Person])` or `sequelize.addModels([__dirname + '/models'])`

### Build and create
Instantiation and inserts can be achieved in the good old sequelize way
```js
const person = Person.build<Person>({name: 'bob', age: 99});
person.save();

Person.create<Person>({name: 'bob', age: 99});
```
but *sequelize-typescript* also provides creation of instances with `new`:
```typescript
const person = new Person({name: 'bob', age: 99});
person.save();
```

### Find and update
See sequelize [docs](http://docs.sequelizejs.com/en/v3/docs/models-usage/) for more details.
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
That's all, *sequelize-typescript* does the rest for you. So when retrieving a team by `find`
```typescript

Team
 .findOne<Team>({include: [Player]})
 .then(team => {
     
     team.players.forEach(player => console.log(`Player ${player.name}`));
 })
```
the players will also be resolved (when passing `include: Player` as the find options)

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
  @BelongsTo(() => Person, 'authorId')
  author: Person; 

  @HasMany(() => Book, 'authorId')
  writtenBooks: Book[];
  
  @BelongsTo(() => Person, 'proofreaderId')
  proofreader: Person; 

  @HasMany(() => Book, 'proofreaderId')
  proofedBooks: Book[];
```

### Type safe usage of generated getter and setter
With the creation of a relation, sequelize generates getter and setter functions on the corresponding
models. So when you create a 1:n relation between `ModelA` and `ModelB`, an instance of `ModelA` will
have the functions `getModelBs`, `setModelBs`, `addModelB`. These functions will still exist with *sequelize-typescript*. 
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
To use them pass the property key of the respective relation as the first parameter - see:
```typescript
const modelA = new ModelA();

modelA.$set('bs', [ /* models */]).then( /* ... */);
modelA.$add('b', /* model */).then( /* ... */);
modelA.$get('bs').then( /* ... */);
```

## Model validation
Validation options can be set through the `@Column` annotation, but if you prefer different
decorators for validation instead, you can do so by simply using the validate options *as* decorators:
So that `validate.isEmail=true` becomes `@IsEmail`, `validate.equals='value'` becomes `@Equals('value')` 
and so on. Please notice, that a validator, that expect booleans, becomes a annotation, which does not
need a parameter. 

See sequelize [docs](http://docs.sequelizejs.com/en/v3/docs/models-definition/#validations) 
for all validators.

### Exceptions
Validators, that cannot simply translated from sequelize validator to an annotation:

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
comes to circular-dependencies (which is in general solved by node for you) `Model` can be `undefined`
when it get passed to @ForeignKey. When using a function, which returns the actual model, we prevent
this issue.