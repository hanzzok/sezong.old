export class Message {
  constructor(
    public readonly type: MessageType,
    public readonly text: string,
    public readonly line: number,
    public readonly from: number,
    public readonly to: number
  ) {}
}

export const enum MessageType {
  Informal,
  Warning,
  Error
}
