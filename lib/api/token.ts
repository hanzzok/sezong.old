import { Pos } from './pos';

export class Token {
  public readonly pos: Pos;
  public readonly length: number;
  public readonly source: string;
  public readonly type: TokenType;

  constructor(type: TokenType, source: string, pos: Pos, length: number) {
    this.pos = pos;
    this.source = source;
    this.type = type;
    this.length = length;
  }
}

export enum TokenType {
  NormalText = 'NormalText',
  WhiteSpace = 'WhiteSpace',

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
