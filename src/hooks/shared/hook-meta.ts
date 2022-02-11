import { HookOptions } from './hook-options';
import { SequelizeHooks } from 'sequelize/types/hooks';

export interface HookMeta {
  hookType: keyof SequelizeHooks;
  methodName: string;
  options?: HookOptions;
}
