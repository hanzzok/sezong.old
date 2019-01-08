export interface Message {
  readonly text: string;
  readonly where: {
    from: {
      line: number;
      column: number;
    };
    to: {
      line: number;
      column: number;
    };
  };
}

export const enum MessageType {
  Informal,
  Warning,
  Error
}
