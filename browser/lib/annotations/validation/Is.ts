import {noop} from '../noop';



export function Is(
  arg: string | Array<string | RegExp> | RegExp | { msg: string; args: string | Array<string | RegExp> | RegExp }
): Function;
export function Is() { return noop }
