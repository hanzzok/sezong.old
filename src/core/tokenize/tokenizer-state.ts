import { Pos } from '../../core';

export default class TokenizerState {
  public pos: Pos = {
    column: 1,
    line: 1,
    real: 0
  };

  public next() {
    this.pos.column++;
    this.pos.real++;
  }

  public nextLine() {
    this.pos.column = 0;
    this.pos.line++;
    this.pos.real++;
  }
}
