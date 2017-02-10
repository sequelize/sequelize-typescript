/// <reference types="sequelize" />
import 'reflect-metadata';
import { FindOptions } from "sequelize";
/**
 * Sets default scope for annotated class
 */
export declare function DefaultScope(scope: FindOptions | Function): Function;
