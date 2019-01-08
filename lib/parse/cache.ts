import { Token, TokenType } from '../api/token';
import { Regex } from '../util';
import TokenizerState from './tokenizer.state';

export default class Cache {
  public data: string = '';
  public line: number = 0;
  public column: number = 0;

  public isBlank: boolean = true;

  public append(state: TokenizerState, data: string, force?: boolean) {
    if (!force) {
      if (Regex.Blank.test(data)) {
        return;
      }
    }
    if (this.isBlank) {
      this.line = state.line;
      this.column = state.column;
    }
    this.data += data;
    this.isBlank = false;
  }

  public createToken(type: TokenType): Token | null {
    if (!this.isBlank) {
      const result = {
        column: this.column,
        line: this.line,
        source: this.data,
        type
      };
      this.data = '';
      this.line = 0;
      this.column = 0;
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
