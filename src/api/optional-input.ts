import { Message, MessageType } from '../core';
import { Token } from './';

// Tokens are required for creating cool quality message.
export type BlockOptionalInputReal =
  // No Block Optional Input
  | undefined
  // Document Block Optional Input
  | string
  // Key-Value Pair Optional Input
  | ObjectBlockOptionalInput;

export interface ObjectBlockOptionalInput {
  [key: string]: ObjectBlockOptionalInputValue;
}

export interface ObjectBlockOptionalInputValue {
  real: string;
  keyTokens: Token[];
  valueTokens: Token[];
}

// Tokens are required for creating cool quality message.
export interface BlockOptionalInput {
  value: BlockOptionalInputReal;
  tokens: Token[];
}

export function beIgnored(
  input: BlockOptionalInput,
  target: Message[],
  message?: string
): void;

export function beIgnored(
  input: BlockOptionalInput,
  message?: string
): Message | null;

export function beIgnored(
  input: BlockOptionalInput,
  targetOrMessage: Message[] | string = 'Input not required',
  message: string = 'Input not required'
): Message | null | void {
  if (input.value === undefined) {
    if (typeof targetOrMessage === 'string') {
      return null;
    } else {
      return;
    }
  } else {
    if (typeof targetOrMessage === 'string') {
      return new Message(
        MessageType.Warning,
        targetOrMessage,
        input.tokens[0],
        input.tokens.slice(-1)[0]
      );
    } else {
      targetOrMessage.push(
        new Message(
          MessageType.Warning,
          message,
          input.tokens[0],
          input.tokens.slice(-1)[0]
        )
      );
    }
  }
}

export function requireDocument(
  input: BlockOptionalInput,
  message: string = 'Input must be document'
): Message | string {
  if (typeof input.value === 'string') {
    return input.value;
  } else {
    return new Message(
      MessageType.Error,
      message,
      input.tokens[0],
      input.tokens.slice(-1)[0]
    );
  }
}

export function requireObject(
  input: BlockOptionalInput,
  message: string = 'Input must be a object'
): Message | ObjectBlockOptionalInput {
  if (typeof input.value === 'object') {
    return input.value;
  } else {
    return new Message(
      MessageType.Error,
      message,
      input.tokens[0],
      input.tokens.slice(-1)[0]
    );
  }
}

export function validateKeys(
  input: ObjectBlockOptionalInput,
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
