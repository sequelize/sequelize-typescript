/// <reference types="sequelize" />
import 'reflect-metadata';
import { DataTypeAbstract } from "sequelize";
/**
 * Sets type option for annotated property to specified value.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
export declare function Type(type: string | DataTypeAbstract): Function;
