import { Token } from '../api';

export class Message {
  public readonly type: MessageType;
  public readonly text: string;
  public readonly from: Token;
  public readonly to: Token;

  constructor(type: MessageType, text: string, from: Token, to: Token) {
    this.type = type;
    this.text = text;
    this.from = from;
    this.to = to;
  }
}

export const enum MessageType {
  Informal,
  Warning,
  Error
}
