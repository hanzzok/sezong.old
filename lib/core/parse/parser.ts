import { Node, NodeType } from '../../api/node';
import { AnyBlockConstructor } from '../../api/rule/blockConstructor';
import { AnyDecorator } from '../../api/rule/decorator';
import { Token, TokenType } from '../../api/token';
import { Regex } from '../../util';
import { Message, MessageType } from '../message';
import { isTokenArray } from './checker';
import { ParseState } from './parser.state';
import { AssertResult, Result } from './types';

export class Parser {
  public readonly messages: Message[] = [];

  private state: ParseState;
  private readonly decoratorNames: string[] = [];
  private readonly blockConstructorSpecialNames: string[] = [];
  private readonly blockConstructorNormalNames: string[] = [];

  constructor(
    decorators: AnyDecorator[],
    blockConstructors: AnyBlockConstructor[],
    tokens: Token[]
  ) {
    this.state = new ParseState(tokens);
    this.decoratorNames = decorators.map(it => it.name);
    for (const blockConstructor of blockConstructors) {
      if (Regex.SpecialCharacter.test(blockConstructor.name[0])) {
        this.blockConstructorSpecialNames.push(blockConstructor.name);
      } else {
        this.blockConstructorNormalNames.push(blockConstructor.name);
        this.blockConstructorNormalNames.push(
          blockConstructor.namespace + ':' + blockConstructor.name
        );
      }
    }
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
          this.blockConstructorSpecialNames.includes(
            this.state.currentToken.source
          )
        ) {
          result = this.nextSpecialBlockConstructor();
        } else {
          return this.nextNormalText();
        }
        break;
      }
      case TokenType.VerticalBar: {
        result = this.nextNormalBlockConstructor();
        break;
      }
      case TokenType.SquareBracketStart: {
        result = this.nextDecorator();
        break;
      }
      default: {
        return this.nextNormalText();
      }
    }
    if (result instanceof Message) {
      this.messages.push(result);
      return this.nextNode();
    } else {
      return result;
    }
  }

  private nextDecorator(): Result {
    const tokens = this.assertNext(
      token => token.type === TokenType.SquareBracketStart
    )();
    if (!isTokenArray(tokens)) {
      return tokens;
    }
    const text = this.state.until(
      (prev, current) =>
        (current.type !== TokenType.SingleQuote &&
          current.type !== TokenType.SquareBracketEnd) ||
        (prev !== null && prev.type === TokenType.BackSlash),
      false
    );
    tokens.push.apply(tokens, text);

    const functions = [];

    const end = () => {
      const chunk = this.state.until(
        (token: Token) =>
          token.type !== TokenType.LineFeed &&
          token.type !== TokenType.SquareBracketEnd,
        true
      );
      return chunk.slice(-1)[0];
    };

    let first = true;

    while (this.state.currentToken.type !== TokenType.SquareBracketEnd) {
      if (!this.state.hasCurrent(TokenType.SingleQuote)) {
        if (first) {
          return this.nextNormalText(tokens);
        }
        return new Message(
          MessageType.Error,
          'Decorator must not contain two or more texts',
          tokens[0],
          end() || tokens.slice(-1)[0]
        );
      }
      first = false;
      const functionTokens = [this.state.cursorNext()];
      if (!this.state.hasCurrent(TokenType.NormalText)) {
        this.messages.push(
          new Message(
            MessageType.Error,
            'No decorator name supplied',
            tokens[0],
            end() || tokens.slice(-1)[0]
          )
        );
      }
      const nameToken = this.state.cursorNext();
      functionTokens.push(nameToken);

      if (this.state.hasCurrent(TokenType.RoundBracketStart)) {
        functionTokens.push(this.state.cursorNext());
        const parameters = this.state.until(
          (prev, current) =>
            current.type !== TokenType.RoundBracketEnd ||
            (prev !== null && prev.type === TokenType.BackSlash),
          false
        );
        functionTokens.push.apply(functionTokens, parameters);
        functionTokens.push(this.state.cursorNext());
        functions.push({
          name: nameToken.source,
          parameters: parameters
            .map(it => it.source)
            .join('')
            .split(',')
        });
      } else {
        functions.push({
          name: nameToken.source,
          parameters: []
        });
      }

      if (!this.decoratorNames.includes(nameToken.source)) {
        const last = functionTokens.slice(-1)[0];
        this.messages.push(
          new Message(
            MessageType.Warning,
            `Undefined decorator: ${functionTokens[1].source}`,
            functionTokens[0],
            last
          )
        );
      }

      tokens.push.apply(tokens, functionTokens);
    }

    tokens.push(this.state.cursorNext());

    return {
      data: {
        functions,
        input: text.map(it => it.source).join('')
      },
      pos: tokens[0].pos,
      tokens,
      type: NodeType.Decorator
    };
  }

  private nextSpecialBlockConstructor(): Result {
    return null;
  }

  private nextNormalBlockConstructor(): Result {
    return null;
  }

  private nextNormalText(readTokens: Token[] = []): Node | null {
    const tokens = readTokens.concat(
      this.state.until((prev, current) => {
        if (prev && prev.type === TokenType.BackSlash) {
          return true;
        }
        switch (current.type) {
          case TokenType.SquareBracketStart:
          case TokenType.LineFeed:
            return false;
          default:
            return true;
        }
      }, false)
    );
    return tokens.length > 0
      ? {
          pos: tokens[0].pos,
          tokens,
          type: NodeType.NormalText
        }
      : null;
  }

  private assertNext(
    condition: (token: Token) => boolean
  ): (tokens?: AssertResult) => AssertResult {
    return (tokens: AssertResult = []) => {
      if (!isTokenArray(tokens)) {
        return tokens;
      }
      const token = this.state.currentToken;
      if (condition(token)) {
        this.state.cursorNext();
        tokens.push(token);
        return tokens;
      } else {
        return this.nextNormalText(tokens);
      }
    };
  }
}
