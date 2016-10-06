import 'reflect-metadata';
import Sequelize = require("sequelize");
import {Type} from "./Type";
import {DataType} from "../models/DataType";

/**
 * Sets type option for annotated property to specified value.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
export const Boolean = Type(DataType.BOOLEAN);
