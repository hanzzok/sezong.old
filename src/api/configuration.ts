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
  input: Configuration,
  knownKeys: string[],
  message: (key: string) => string = key => `Key '${key}' is unused key`
): Message[] {
  const result: Message[] = [];
  for (const key of Object.keys(input)) {
    if (knownKeys.includes(key)) {
      continue;
    }
    result.push(
      new Message(
        MessageType.Informal,
        message(key),
        input[key].keyTokens[0],
        input[key].keyTokens.slice(-1)[0]
      )
    );
  }
  return result;
}

export function asJsObject(config: Configuration | undefined): undefined | any {
  if (!config) {
    return undefined;
  }
  const result: any = {};
  for (const key of Object.keys(config)) {
    result[key] = config[key].real;
  }
  return result;
}
