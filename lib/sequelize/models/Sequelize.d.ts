import 'reflect-metadata';
import {
  AccessDeniedError,
  and, BaseError,
  cast,
  col, ConnectionError, ConnectionRefusedError, ConnectionTimedOutError, DatabaseError, DataTypeAbstract, DataTypeArray,
  DataTypeBigInt,
  DataTypeBlob,
  DataTypeBoolean,
  DataTypeChar, DataTypeDate,
  DataTypeDateOnly,
  DataTypeDecimal,
  DataTypeDouble,
  DataTypeEnum, DataTypeFloat,
  DataTypeGeometry,
  DataTypeHStore,
  DataTypeInteger, DataTypeJSONB,
  DataTypeJSONType,
  DataTypeMediumInt, DataTypeNow, DataTypeNumber, DataTypeRange, DataTypeReal,
  DataTypes, DataTypeSmallInt, DataTypeString, DataTypeText, DataTypeTime, DataTypeTinyInt, DataTypeUUID,
  DataTypeUUIDv1,
  DataTypeUUIDv4,
  DataTypeVirtual,
  Deferrable,
  DefineAttributes,
  DefineOptions,
  DestroyOptions,
  DropOptions, EmptyResultError, ExclusionConstraintError,
  fn, ForeignKeyConstraintError, HostNotFoundError, HostNotReachableError, InvalidConnectionError,
  json,
  literal,
  Operators,
  Options,
  or,
  QueryInterface,
  QueryOptions,
  QueryOptionsTransactionRequired,
  QueryTypes,
  SequelizeStatic,
  SyncOptions, TimeoutError,
  Transaction,
  TransactionOptions,
  TransactionStatic, UniqueConstraintError,
  Utils,
  ValidationError, ValidationErrorItem,
  Validator,
  where
} from 'sequelize';
import {Model} from "../../model/models/Model";
import {SequelizeOptions} from "../types/SequelizeOptions";
import {Namespace} from 'continuation-local-storage';
import {Hooks} from '../../hooks/models/Hooks';
import {IQueryOptions} from '../interfaces/IQueryOptions';

/**
 * Based on "Sequelize" type definitions from:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sequelize/index.d.ts#L5849
 */

export declare class Sequelize extends Hooks {

  /**
   * Provide access to continuation-local-storage (http://docs.sequelizejs.com/en/latest/api/sequelize/#transactionoptions-promise)
   */
  static cls: any;

  /**
   * A convenience class holding commonly used data types. The datatypes are used when definining a new model
   * using
   * `Sequelize.define`, like this:
   *
   * ```js
   * sequelize.define('model', {
   *   column: DataTypes.INTEGER
   * })
   * ```
   * When defining a model you can just as easily pass a string as type, but often using the types defined here
   * is
   * beneficial. For example, using `DataTypes.BLOB`, mean that that column will be returned as an instance of
   * `Buffer` when being fetched by sequelize.
   *
   * Some data types have special properties that can be accessed in order to change the data type.
   * For example, to get an unsigned integer with zerofill you can do `DataTypes.INTEGER.UNSIGNED.ZEROFILL`.
   * The order you access the properties in do not matter, so `DataTypes.INTEGER.ZEROFILL.UNSIGNED` is fine as
   * well. The available properties are listed under each data type.
   *
   * To provide a length for the data type, you can invoke it like a function: `INTEGER(2)`
   *
   * Three of the values provided here (`NOW`, `UUIDV1` and `UUIDV4`) are special default values, that should not
   * be used to define types. Instead they are used as shorthands for defining default values. For example, to
   * get a uuid field with a default value generated following v1 of the UUID standard:
   *
   * ```js
   * sequelize.define('model', {
   *   uuid: {
   *     type: DataTypes.UUID,
   *     defaultValue: DataTypes.UUIDV1,
   *     primaryKey: true
   *   }
   * })
   * ```
   */
  static ABSTRACT: DataTypeAbstract;
  static STRING: DataTypeString;
  static CHAR: DataTypeChar;
  static TEXT: DataTypeText;
  static NUMBER: DataTypeNumber;
  static TINYINT: DataTypeTinyInt;
  static SMALLINT: DataTypeSmallInt;
  static MEDIUMINT: DataTypeMediumInt;
  static INTEGER: DataTypeInteger;
  static BIGINT: DataTypeBigInt;
  static FLOAT: DataTypeFloat;
  static TIME: DataTypeTime;
  static DATE: DataTypeDate;
  static DATEONLY: DataTypeDateOnly;
  static BOOLEAN: DataTypeBoolean;
  static NOW: DataTypeNow;
  static BLOB: DataTypeBlob;
  static DECIMAL: DataTypeDecimal;
  static NUMERIC: DataTypeDecimal;
  static UUID: DataTypeUUID;
  static UUIDV1: DataTypeUUIDv1;
  static UUIDV4: DataTypeUUIDv4;
  static HSTORE: DataTypeHStore;
  static JSON: DataTypeJSONType;
  static JSONB: DataTypeJSONB;
  static VIRTUAL: DataTypeVirtual;
  static ARRAY: DataTypeArray;
  static NONE: DataTypeVirtual;
  static ENUM: DataTypeEnum;
  static RANGE: DataTypeRange;
  static REAL: DataTypeReal;
  static DOUBLE: DataTypeDouble;
  static "DOUBLE PRECISION": DataTypeDouble;
  static GEOMETRY: DataTypeGeometry;

  Error: BaseError;
  static Error: BaseError;
  ValidationError: ValidationError;
  static ValidationError: ValidationError;
  ValidationErrorItem: ValidationErrorItem;
  static ValidationErrorItem: ValidationErrorItem;
  DatabaseError: DatabaseError;
  static DatabaseError: DatabaseError;
  TimeoutError: TimeoutError;
  static TimeoutError: TimeoutError;
  UniqueConstraintError: UniqueConstraintError;
  static UniqueConstraintError: UniqueConstraintError;
  ExclusionConstraintError: ExclusionConstraintError;
  static ExclusionConstraintError: ExclusionConstraintError;
  ForeignKeyConstraintError: ForeignKeyConstraintError;
  static ForeignKeyConstraintError: ForeignKeyConstraintError;
  ConnectionError: ConnectionError;
  static ConnectionError: ConnectionError;
  ConnectionRefusedError: ConnectionRefusedError;
  static ConnectionRefusedError: ConnectionRefusedError;
  AccessDeniedError: AccessDeniedError;
  static AccessDeniedError: AccessDeniedError;
  HostNotFoundError: HostNotFoundError;
  static HostNotFoundError: HostNotFoundError;
  HostNotReachableError: HostNotReachableError;
  static HostNotReachableError: HostNotReachableError;
  InvalidConnectionError: InvalidConnectionError;
  static InvalidConnectionError: InvalidConnectionError;
  ConnectionTimedOutError: ConnectionTimedOutError;
  static ConnectionTimedOutError: ConnectionTimedOutError;
  EmptyResultError: EmptyResultError;
  static EmptyResultError: EmptyResultError;

  /**
   * A reference to sequelize utilities. Most users will not need to use these utils directly. However, you
   * might want to use `Sequelize.Utils._`, which is a reference to the lodash library, if you don't already
   * have it imported in your project.
   */
  Utils: Utils;
  static Utils: Utils;

  /**
   * A modified version of bluebird promises, that allows listening for sql events
   */
  Promise: typeof Promise;
  static Promise: typeof Promise;

  /**
   * Available query types for use with `sequelize.query`
   */
  QueryTypes: QueryTypes;
  static QueryTypes: QueryTypes;

  /**
   * Exposes the validator.js object, so you can extend it with custom validation functions.
   * The validator is exposed both on the instance, and on the constructor.
   */
  Validator: Validator;
  static Validator: Validator;

  /**
   * A Model represents a table in the database. Sometimes you might also see it referred to as model, or
   * simply as factory. This class should not be instantiated directly, it is created using sequelize.define,
   * and already created models can be loaded using sequelize.import
   */
  Model: typeof Model;
  static Model: typeof Model;

  /**
   * A reference to the sequelize transaction class. Use this to access isolationLevels when creating a
   * transaction
   */
  Transaction: TransactionStatic;
  static Transaction: TransactionStatic;

  /**
   * A reference to the deferrable collection. Use this to access the different deferrable options.
   */
  Deferrable: Deferrable;
  static Deferrable: Deferrable;

  Op: Operators;
  static Op: Operators;

  connectionManager: any;

  /**
   * A reference to Sequelize constructor from sequelize. Useful for accessing DataTypes, Errors etc.
   */
  Sequelize: SequelizeStatic;

  /**
   * Defined models.
   */
  models: { [name: string]: typeof Model };
  _: { [modelName: string]: (typeof Model) };

  /**
   * Defined options.
   */
  options: Options;

  static useCLS(namespace: Namespace): Sequelize;

  /**
   * Instantiate sequelize with an URI
   * @name Sequelize
   * @constructor
   *
   * @param uri A full database URI
   * @param options See above for possible options
   */
  constructor(uri: string, options?: SequelizeOptions);
  constructor(uri: string);

  /**
   * Instantiate sequelize with an options object which containing username, password, database
   * @name Sequelize
   * @constructor
   *
   * @param options An object with options. See above for possible options
   */
  constructor(options: SequelizeOptions);

  /**
   * Creates a object representing a database function. This can be used in search queries, both in where and
   * order parts, and as default values in column definitions. If you want to refer to columns in your
   * function, you should use `sequelize.col`, so that the columns are properly interpreted as columns and
   * not a strings.
   *
   * Convert a user's username to upper case
   * ```js
   * instance.updateAttributes({
   *   username: self.sequelize.fn('upper', self.sequelize.col('username'))
   * })
   * ```
   * @param fn The function you want to call
   * @param args All further arguments will be passed as arguments to the function
   */
  fn(fn: string, ...args: any[]): fn;
  static fn(fn: string, ...args: any[]): fn;

  /**
   * Creates a object representing a column in the DB. This is often useful in conjunction with
   * `sequelize.fn`, since raw string arguments to fn will be escaped.
   *
   * @param col The name of the column
   */
  col(col: string): col;
  static col(col: string): col;

  /**
   * Creates a object representing a call to the cast function.
   *
   * @param val The value to cast
   * @param type The type to cast it to
   */
  cast(val: any, type: string): cast;
  static cast(val: any, type: string): cast;

  /**
   * Creates a object representing a literal, i.e. something that will not be escaped.
   *
   * @param val
   */
  literal(val: any): literal;
  static literal(val: any): literal;

  asIs(val: any): literal;
  static asIs(val: any): literal;

  /**
   * An AND query
   *
   * @param args Each argument will be joined by AND
   */
  and(...args: Array<string | Object>): and;
  static and(...args: Array<string | Object>): and;

  /**
   * An OR query
   *
   * @param args Each argument will be joined by OR
   */
  or(...args: Array<string | Object>): or;
  static or(...args: Array<string | Object>): or;

  /**
   * Creates an object representing nested where conditions for postgres's json data-type.
   *
   * @param conditionsOrPath A hash containing strings/numbers or other nested hash, a string using dot
   *     notation or a string using postgres json syntax.
   * @param value An optional value to compare against. Produces a string of the form "<json path> =
   *     '<value>'".
   */
  json(conditionsOrPath: string | Object, value?: string | number | boolean): json;
  static json(conditionsOrPath: string | Object, value?: string | number | boolean): json;

  /**
   * A way of specifying attr = condition.
   *
   * The attr can either be an object taken from `Model.rawAttributes` (for example `Model.rawAttributes.id`
   * or
   * `Model.rawAttributes.name`). The attribute should be defined in your model definition. The attribute can
   * also be an object from one of the sequelize utility functions (`sequelize.fn`, `sequelize.col` etc.)
   *
   * For string attributes, use the regular `{ where: { attr: something }}` syntax. If you don't want your
   * string to be escaped, use `sequelize.literal`.
   *
   * @param attr The attribute, which can be either an attribute object from `Model.rawAttributes` or a
   *     sequelize object, for example an instance of `sequelize.fn`. For simple string attributes, use the
   *     POJO syntax
   * @param comparator Comparator
   * @param logic The condition. Can be both a simply type, or a further condition (`.or`, `.and`, `.literal`
   *     etc.)
   */
  where(attr: Object, comparator: string, logic: string | Object): where;
  where(attr: Object, logic: string | Object): where;
  static where(attr: Object, comparator: string, logic: string | Object): where;
  static where(attr: Object, logic: string | Object): where;

  condition(attr: Object, logic: string | Object): where;
  static condition(attr: Object, logic: string | Object): where;

  /**
   * Returns the specified dialect.
   */
  getDialect(): string;

  /**
   * Returns an instance of QueryInterface.
   */
  getQueryInterface(): QueryInterface;

  /**
   * Define a new model, representing a table in the DB.
   *
   * The table columns are define by the hash that is given as the second argument. Each attribute of the
   * hash
   * represents a column. A short table definition might look like this:
   *
   * ```js
   * sequelize.define('modelName', {
   *     columnA: {
   *         type: Sequelize.BOOLEAN,
   *         validate: {
   *           is: ["[a-z]",'i'],        // will only allow letters
   *           max: 23,                  // only allow values <= 23
   *           isIn: {
   *             args: [['en', 'zh']],
   *             msg: "Must be English or Chinese"
   *           }
   *         },
   *         field: 'column_a'
   *         // Other attributes here
   *     },
   *     columnB: Sequelize.STRING,
   *     columnC: 'MY VERY OWN COLUMN TYPE'
   * })
   *
   * sequelize.models.modelName // The model will now be available in models under the name given to define
   * ```
   *
   * As shown above, column definitions can be either strings, a reference to one of the datatypes that are
   * predefined on the Sequelize constructor, or an object that allows you to specify both the type of the
   * column, and other attributes such as default values, foreign key constraints and custom setters and
   * getters.
   *
   * For a list of possible data types, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
   *
   * For more about getters and setters, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#getters-setters
   *
   * For more about instance and class methods, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
   *
   * For more about validation, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#validations
   *
   * @param modelName  The name of the model. The model will be stored in `sequelize.models` under this name
   * @param attributes An object, where each attribute is a column of the table. Each column can be either a
   *                   DataType, a string or a type-description object, with the properties described below:
   * @param options    These options are merged with the default define options provided to the Sequelize
   *                   constructor
   */
  define<T extends Model<T>>(modelName: string,
                             attributes: DefineAttributes,
                             options?: DefineOptions<T>): typeof Model;

  /**
   * Fetch a Model which is already defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  model<T extends Model<T>>(modelName: string): typeof Model;

  /**
   * Checks whether a model with the given name is defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  isDefined(modelName: string): boolean;

  /**
   * Imports a model defined in another file
   *
   * Imported models are cached, so multiple calls to import with the same path will not load the file
   * multiple times
   *
   * See https://github.com/sequelize/sequelize/blob/master/examples/using-multiple-model-files/Task.js for a
   * short example of how to define your models in separate files so that they can be imported by
   * sequelize.import
   *
   * @param path The path to the file that holds the model you want to import. If the part is relative, it
   *     will be resolved relatively to the calling file
   *
   * @param defineFunction An optional function that provides model definitions. Useful if you do not
   *     want to use the module root as the define function
   */
  import<T extends Model<T>>(path: string,
                             defineFunction?: (sequelize: Sequelize, dataTypes: DataTypes) =>
                               Model<T>): typeof Model;

  /**
   * Execute a query on the DB, with the posibility to bypass all the sequelize goodness.
   *
   * By default, the function will return two arguments: an array of results, and a metadata object,
   * containing number of affected rows etc. Use `.spread` to access the results.
   *
   * If you are running a type of query where you don't need the metadata, for example a `SELECT` query, you
   * can pass in a query type to make sequelize format the results:
   *
   * ```js
   * sequelize.query('SELECT...').spread(function (results, metadata) {
   *   // Raw query - use spread
   * });
   *
   * sequelize.query('SELECT...', { type: sequelize.QueryTypes.SELECT }).then(function (results) {
   *   // SELECT query - use then
   * })
   * ```
   *
   * @param sql
   * @param options Query options
   */
  query(sql: string | { query: string, values: any[] }, options?: IQueryOptions): Promise<any>;

  /**
   * Execute a query which would set an environment or user variable. The variables are set per connection,
   * so this function needs a transaction.
   *
   * Only works for MySQL.
   *
   * @param variables Object with multiple variables.
   * @param options Query options.
   */
  set(variables: Object, options: QueryOptionsTransactionRequired): Promise<any>;

  /**
   * Escape value.
   *
   * @param value Value that needs to be escaped
   */
  escape(value: string): string;

  /**
   * Create a new database schema.
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this command will do nothing.
   *
   * @param schema Name of the schema
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  createSchema(schema: string, options: { logging?: boolean | Function }): Promise<any>;

  /**
   * Show all defined schemas
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this will show all tables.
   *
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  showAllSchemas(options: { logging?: boolean | Function }): Promise<any>;

  /**
   * Drop a single schema
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this drop a table matching the schema name
   *
   * @param schema Name of the schema
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  dropSchema(schema: string, options: { logging?: boolean | Function }): Promise<any>;

  /**
   * Drop all schemas
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this is the equivalent of drop all tables.
   *
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  dropAllSchemas(options: { logging?: boolean | Function }): Promise<any>;

  /**
   * Sync all defined models to the DB.
   *
   * @param options Sync Options
   */
  sync(options?: SyncOptions): Promise<any>;

  /**
   * Truncate all tables defined through the sequelize models. This is done
   * by calling Model.truncate() on each model.
   *
   * @param {object} [options] The options passed to Model.destroy in addition to truncate
   * @param {Boolean|function} [options.transaction]
   * @param {Boolean|function} [options.logging] A function that logs sql queries, or false for no logging
   */
  truncate(options?: DestroyOptions): Promise<any>;

  /**
   * Drop all tables defined through this sequelize instance. This is done by calling Model.drop on each model
   * @see {Model#drop} for options
   *
   * @param options The options passed to each call to Model.drop
   */
  drop(options?: DropOptions): Promise<any>;

  /**
   * Test the connection by trying to authenticate
   *
   * @param options Query Options for authentication
   */
  authenticate(options?: QueryOptions): Promise<void>;

  validate(options?: QueryOptions): Promise<ValidationError>;

  /**
   * Start a transaction. When using transactions, you should pass the transaction in the options argument
   * in order for the query to happen under that transaction
   *
   * ```js
   * sequelize.transaction().then(function (t) {
   *   return User.find(..., { transaction: t}).then(function (user) {
   *     return user.updateAttributes(..., { transaction: t});
   *   })
   *   .then(t.commit.bind(t))
   *   .catch(t.rollback.bind(t));
   * })
   * ```
   *
   * A syntax for automatically committing or rolling back based on the promise chain resolution is also
   * supported:
   *
   * ```js
   * sequelize.transaction(function (t) { // Note that we use a callback rather than a promise.then()
   *   return User.find(..., { transaction: t}).then(function (user) {
   *     return user.updateAttributes(..., { transaction: t});
   *   });
   * }).then(function () {
   *   // Commited
   * }).catch(function (err) {
   *   // Rolled back
   *   console.error(err);
   * });
   * ```
   *
   * If you have [CLS](https://github.com/othiym23/node-continuation-local-storage) enabled, the transaction
   * will automatically be passed to any query that runs witin the callback. To enable CLS, add it do your
   * project, create a namespace and set it on the sequelize constructor:
   *
   * ```js
   * var cls = require('continuation-local-storage'),
   *     ns = cls.createNamespace('....');
   * var Sequelize = require('sequelize');
   * Sequelize.cls = ns;
   * ```
   * Note, that CLS is enabled for all sequelize instances, and all instances will share the same namespace
   *
   * @param options Transaction Options
   * @param autoCallback Callback for the transaction
   */
  transaction(options: TransactionOptions,
              autoCallback: (t: Transaction) => PromiseLike<any>): Promise<any>;
  transaction(autoCallback: (t: Transaction) => PromiseLike<any>): Promise<any>;
  transaction(options?: TransactionOptions): Promise<Transaction>;

  /**
   * Close all connections used by this sequelize instance, and free all references so the instance can be
   * garbage collected.
   *
   * Normally this is done on process exit, so you only need to call this method if you are creating multiple
   * instances, and want to garbage collect some of them.
   */
  close(): Promise<void>;

  /**
   * Returns the database version
   */
  databaseVersion(): Promise<string>;

  addModels(models: Array<typeof Model>): void;
  addModels(modelPaths: string[]): void;
}
