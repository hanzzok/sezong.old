import { Pos, Token, TokenType } from '../../api';
import TokenizerState from './tokenizer-state';

export default class Cache {
  public data: string = '';
  public startPos: Pos = {
    column: 0,
    line: 0,
    real: 0
  };
  public start: number = 0;
  public column: number = 0;

  public isBlank: boolean = true;

  private readonly state: TokenizerState;

  constructor(state: TokenizerState) {
    this.state = state;
  }

  public append(data: string) {
    if (this.isBlank) {
      this.startPos = {
        column: this.state.pos.column,
        line: this.state.pos.line,
        real: this.state.pos.real
      };
    }
    this.data += data;
    this.isBlank = false;
  }

  public createToken(type: TokenType): Token | null {
    if (!this.isBlank) {
      const result = new Token(
        type,
        this.data,
        {
          column: this.startPos.column,
          line: this.startPos.line,
          real: this.startPos.real
        },
        this.data.length
      );
      this.data = '';
      this.startPos = {
        column: 0,
        line: 0,
        real: 0
      };
      this.isBlank = true;
      return result;
    } else {
      return null;
    }
  }
  public appendTokenTo(target: Token[], type: TokenType) {
    const token = this.createToken(type);
    if (token) {
      target.push(token);
    }
  }
}
