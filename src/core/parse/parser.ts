import {
  CompilerConfiguration,
  Node,
  NodeType,
  Token,
  TokenType
} from '../../core';
import nextNormalBlockConstructor from './functions/block-constructor-normal';
import nextSpecialBlockConstructor from './functions/block-constructor-special';
import nextDecorator from './functions/decorator';
import nextNormalText from './functions/normal-text';
import ParseState from './parser-state';

export default class Parser {
  public state: ParseState;
  private configuration: CompilerConfiguration;

  constructor(configuration: CompilerConfiguration, tokens: Token[]) {
    this.configuration = configuration;
    this.state = new ParseState(tokens);
  }

  public parse(): Node[] {
    const result: Node[] = [];

    for (let node = this.nextNode(); node !== null; node = this.nextNode()) {
      result.push(node);
    }

    return result;
  }

  public nextNode(): Node | null {
    const linefeeds = [];
    while (this.state.hasCurrent(TokenType.LineFeed)) {
      linefeeds.push(this.state.cursorNext());
    }
    if (linefeeds.length >= 2) {
      return {
        pos: linefeeds[0].pos,
        tokens: linefeeds,
        type: NodeType.ParagraphSplit
      };
    }
    if (!this.state.hasCurrent()) {
      return null;
    }
    switch (this.state.currentToken.type) {
      case TokenType.NormalText: {
        if (
          this.state.currentToken.source in
          this.configuration.blockConstructorSpecialNames
        ) {
          return nextSpecialBlockConstructor(this.configuration, this.state);
        } else {
          return nextNormalText(this.state);
        }
      }
      case TokenType.VerticalBar: {
        return nextNormalBlockConstructor(this.configuration, this.state);
      }
      case TokenType.SquareBracketStart: {
        return nextDecorator(this.state, this.configuration);
      }
      default: {
        return nextNormalText(this.state);
      }
    }
  }
}
