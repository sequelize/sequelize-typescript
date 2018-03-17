import {Model} from 'sequelize';
import {getAllPropertyNames} from '../utils/object';

export const staticModelFunctionProperties = getAllPropertyNames(Model)
  .filter(key =>
    !isForbiddenMember(key) &&
    isFunctionMember(key, Model) &&
    !isPrivateMember(key)
  );

function isFunctionMember(propertyKey: string, target: any): boolean {
  return typeof target[propertyKey] === 'function';
}

function isForbiddenMember(propertyKey: string): boolean {
  const FORBIDDEN_KEYS = ['name', 'constructor', 'length', 'prototype', 'caller', 'arguments', 'apply',
    'QueryInterface', 'QueryGenerator', 'init', 'replaceHookAliases', 'refreshAttributes'];
  return FORBIDDEN_KEYS.indexOf(propertyKey) !== -1;
}

function isPrivateMember(propertyKey: string): boolean {
  return (propertyKey.charAt(0) === '_');
}
