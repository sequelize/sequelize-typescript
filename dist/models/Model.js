"use strict";
require('reflect-metadata');
var Model = (function () {
    function Model() {
        throw new Error('Model is not newable; Use register ...'); // todo
    }
    /**
     * Get an object representing the query for this instance, use with `options.where`
     */
    Model.prototype.where = function () {
        return {};
    };
    /**
     * Get the value of the underlying data value
     */
    Model.prototype.getDataValue = function (key) {
        return {};
    };
    /**
     * Update the underlying data value
     */
    Model.prototype.setDataValue = function (key, value) {
    };
    Model.prototype.get = function (key, options) {
        return {};
    };
    Model.prototype.set = function (key, value, options) {
        return this;
    };
    Model.prototype.setAttributes = function (key, value, options) {
        return this;
    };
    Model.prototype.changed = function (any) {
    };
    /**
     * Returns the previous value for key from `_previousDataValues`.
     */
    Model.prototype.previous = function (key) {
        return {};
    };
    /**
     * Validate this instance, and if the validation passes, persist it to the database.
     *
     * On success, the callback will be called with this instance. On validation error, the callback will be
     * called with an instance of `Sequelize.ValidationError`. This error will have a property for each of the
     * fields for which validation failed, with the error message for that field.
     */
    Model.prototype.save = function (options) {
        return {};
    };
    /**
     * Refresh the current instance in-place, i.e. update the object with current data from the DB and return
     * the same object. This is different from doing a `find(Instance.id)`, because that would create and
     * return a new instance. With this method, all references to the Instance are updated with the new data
     * and no new objects are created.
     */
    Model.prototype.reload = function (options) {
        return {};
    };
    /**
     * Validate the attribute of this instance according to validation rules set in the model definition.
     *
     * Emits null if and only if validation successful; otherwise an Error instance containing
     * { field name : [error msgs] } entries.
     *
     * @param options.skip An array of strings. All properties that are in this array will not be validated
     */
    Model.prototype.validate = function (options) {
        return {};
    };
    Model.prototype.update = function (key, value, options) {
        return {};
    };
    Model.prototype.updateAttributes = function (key, value, options) {
        return {};
    };
    /**
     * Destroy the row corresponding to this instance. Depending on your setting for paranoid, the row will
     * either be completely deleted, or have its deletedAt timestamp set to the current time.
     */
    Model.prototype.destroy = function (options) {
        return {};
    };
    /**
     * Restore the row corresponding to this instance. Only available for paranoid models.
     */
    Model.prototype.restore = function (options) {
        return {};
    };
    /**
     * Increment the value of one or more columns. This is done in the database, which means it does not use
     * the values currently stored on the Instance. The increment is done using a
     * ```sql
     * SET column = column + X
     * ```
     * query. To get the correct value after an increment into the Instance you should do a reload.
     *
     *```js
     * instance.increment('number') // increment number by 1
     * instance.increment(['number', 'count'], { by: 2 }) // increment number and count by 2
     * instance.increment({ answer: 42, tries: 1}, { by: 2 }) // increment answer by 42, and tries by 1.
     *                                                        // `by` is ignored, since each column has its own
     *                                                        // value
     * ```
     *
     * @param fields If a string is provided, that column is incremented by the value of `by` given in options.
     *               If an array is provided, the same is true for each column.
     *               If and object is provided, each column is incremented by the value given.
     */
    Model.prototype.increment = function (fields, options) {
        return {};
    };
    /**
     * Decrement the value of one or more columns. This is done in the database, which means it does not use
     * the values currently stored on the Instance. The decrement is done using a
     * ```sql
     * SET column = column - X
     * ```
     * query. To get the correct value after an decrement into the Instance you should do a reload.
     *
     * ```js
     * instance.decrement('number') // decrement number by 1
     * instance.decrement(['number', 'count'], { by: 2 }) // decrement number and count by 2
     * instance.decrement({ answer: 42, tries: 1}, { by: 2 }) // decrement answer by 42, and tries by 1.
     *                                                        // `by` is ignored, since each column has its own
     *                                                        // value
     * ```
     *
     * @param fields If a string is provided, that column is decremented by the value of `by` given in options.
     *               If an array is provided, the same is true for each column.
     *               If and object is provided, each column is decremented by the value given
     */
    Model.prototype.decrement = function (fields, options) {
        return {};
    };
    /**
     * Check whether all values of this and `other` Instance are the same
     */
    Model.prototype.equals = function (other) {
        return {};
    };
    /**
     * Check if this is eqaul to one of `others` by calling equals
     */
    Model.prototype.equalsOneOf = function (others) {
        return {};
    };
    /**
     * Convert the instance to a JSON representation. Proxies to calling `get` with no keys. This means get all
     * values gotten from the DB, and apply all custom getters.
     */
    Model.prototype.toJSON = function () {
        return {};
    };
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=Model.js.map