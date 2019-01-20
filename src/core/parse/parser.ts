import { Node, NodeType } from '../../api/node';
import { Token, TokenType } from '../../api/token';
import { Message } from '../message';
import { nextNormalBlockConstructor } from './functions/blockConstructor.normal';
import { nextSpecialBlockConstructor } from './functions/blockConstructor.special';
import nextDecorator from './functions/decorator';
import nextNormalText from './functions/normalText';
import ParserConfiguration from './parser.configuration';
import { ParseState } from './parser.state';
import { Result } from './types';

export class Parser {
  public state: ParseState;
  private configuration: ParserConfiguration;

  constructor(configuration: ParserConfiguration, tokens: Token[]) {
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
    let result: Result;
    switch (this.state.currentToken.type) {
      case TokenType.NormalText: {
        if (
          this.configuration.blockConstructorSpecialNames.includes(
            this.state.currentToken.source
          )
        ) {
          result = nextSpecialBlockConstructor(this.configuration, this.state);
        } else {
          return nextNormalText(this.state);
        }
        break;
      }
      case TokenType.VerticalBar: {
        result = nextNormalBlockConstructor(this.configuration, this.state);
        break;
      }
      case TokenType.SquareBracketStart: {
        result = nextDecorator(this.state, this.configuration);
        break;
      }
      default: {
        return nextNormalText(this.state);
      }
    }
    if (result instanceof Message) {
      this.state.messages.push(result);
      return this.nextNode();
    } else {
      return result;
    }
  }
}
