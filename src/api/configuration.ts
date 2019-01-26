import { Token } from '.';
import { Message, MessageType } from '../core';

export interface Configuration {
  [key: string]: ConfigurationValue;
}

export interface ConfigurationValue {
  real: string;
  keyTokens: Token[];
  valueTokens: Token[];
}

export function validateKeys(
  config: Configuration | undefined,
  knownKeys: string[],
  message: (key: string) => string = key => `Key '${key}' is unused key`
): Message[] {
  const result: Message[] = [];
  if (!config) {
    return result;
  }
  for (const key of Object.keys(config)) {
    if (knownKeys.includes(key)) {
      continue;
    }
    result.push(
      new Message(
        MessageType.Informal,
        message(key),
        config[key].keyTokens[0],
        config[key].keyTokens.slice(-1)[0]
      )
    );
  }
  return result;
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

export function getIfExists(
  config: Configuration | undefined,
  key: string
): string | undefined {
  return config && config[key] && config[key].real;
}
