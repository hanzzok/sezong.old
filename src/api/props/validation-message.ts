import { MessageType } from '../../core';

export default class ValidationMessage {
  constructor(
    public readonly type: MessageType,
    public readonly message: string,
    public readonly key: string,
    public readonly range?: {
      from: number;
      to: number;
    }
  ) {}
}
