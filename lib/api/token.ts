export interface Token {
  readonly line: number;
  readonly column: number;

  readonly source: string;
  readonly type: TokenType;
}

export enum TokenType {
  NormalText = 'NormalText',

  CurlyBracketStart = 'CurlyBracketStart',
  CurlyBracketEnd = 'CurlyBracketEnd',

  SquareBracketStart = 'SquareBracketStart',
  SquareBracketEnd = 'SquareBracketEnd',

  RoundBracketStart = 'RoundBracketStart',
  RoundBracketEnd = 'RoundBracketEnd',

  BackSlash = 'BackSlash',
  LineFeed = 'LineFeed',
  SingleQuote = 'SingleQuote',
  Assign = 'Assign',
  Comma = 'Comma',
  VerticalBar = 'VerticalBar'
}
