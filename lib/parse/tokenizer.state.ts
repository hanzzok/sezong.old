export default class TokenizerState {
  public column: number = 0;
  public line: number = 0;
  public beforeWhitespace: boolean = false;

  public next() {
    this.column++;
    this.beforeWhitespace = false;
  }

  public nextLine() {
    this.column = 0;
    this.line++;
    this.beforeWhitespace = true;
  }
}
