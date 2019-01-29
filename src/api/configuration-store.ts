import { Token } from '../core';

export interface Configuration {
  [key: string]: ConfigurationValue;
}

export interface ConfigurationValue {
  real: string;
  keyTokens: Token[];
  valueTokens: Token[];
}

export function asJsObject(config: Configuration | undefined): any | undefined {
  if (!config) {
    return undefined;
  }
  const result: any = {};
  for (const key of Object.keys(config)) {
    result[key] = config[key].real;
  }
  return result;
}
