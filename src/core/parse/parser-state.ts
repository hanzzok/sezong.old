import { Message, Token, TokenType } from '../../core';
import { TokenCondition } from './types';

export default class ParseState {
  public readonly tokens: Token[];
  public readonly messages: Message[] = [];
  private index: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public cursorNext(): Token {
    const current = this.currentToken;
    this.index++;
    return current;
  }

  public get hasPrev(): boolean {
    return 0 < this.index;
  }

  public hasCurrent(type?: TokenType): boolean {
    return (
      this.index < this.tokens.length &&
      (type === undefined || this.currentToken.type === type)
    );
  }

  public get hasNext(): boolean {
    return this.index + 1 < this.tokens.length;
  }

  public get prevToken(): Token {
    return this.tokens[this.index - 1];
  }

  public get currentToken(): Token {
    return this.tokens[this.index];
  }

  public skipWhitespace(andLinefeed: boolean = false): Token[] {
    return this.until(
      (token: Token) =>
        token.type === TokenType.WhiteSpace ||
        (andLinefeed && token.type === TokenType.LineFeed)
    );
  }

  public until(
    condition: TokenCondition,
    option?: { eatLast?: true; escape?: false }
  ): Token[] {
    const result: Token[] = [];
    if (!this.hasCurrent()) {
      return result;
    }
    let beforeBackslash: Token | undefined;
    while (
      this.hasCurrent() &&
      ((beforeBackslash && (!option || option.escape !== false)) ||
        condition(this.currentToken))
    ) {
      beforeBackslash = undefined;
      const current = this.currentToken;
      if (
        (!option || option.escape !== false) &&
        current.type === TokenType.BackSlash
      ) {
        beforeBackslash = this.currentToken;
        this.cursorNext();
      } else {
        result.push(this.cursorNext());
      }
    }
    if (beforeBackslash) {
      result.push(beforeBackslash);
    }
    if (option && option.eatLast === true && this.hasCurrent) {
      result.push(this.cursorNext());
    }
    return result;
  }
}
