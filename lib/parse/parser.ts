import { DecoratorData, Node, NodeType } from '../api/node';
import RenderableBlock from '../api/render/renderable.block';
import RenderableText from '../api/render/renderable.text';
import BlockConstructor from '../api/rule/blockConstructor';
import Decorator from '../api/rule/decorator';
import { Token, TokenType } from '../api/token';
import { Regex } from '../util';
import {
  BlockConstructorMode,
  DecoratorFunctionMode,
  ParseState
} from './parser.state';

export default function parse(
  _decorators: Array<Decorator<any, RenderableText>>,
  blockConstructors: Array<BlockConstructor<any, RenderableBlock>>,
  tokens: Token[]
): Node[] {
  const children = [] as Node[];

  const state = new ParseState();

  const blockConstructorSpecialNames: string[] = [];
  const blockConstructorNormalNames: string[] = [];
  blockConstructors.forEach(it => {
    if (Regex.SpecialCharacter.test(it.name[0])) {
      blockConstructorSpecialNames.push(it.name);
    } else {
      blockConstructorNormalNames.push(it.name);
      blockConstructorNormalNames.push(it.namespace + ':' + it.name);
    }
  });

  let before: Token | null = null;

  function flush() {
    if (state.surplusTokens.length > 0) {
      children.push({
        column: state.surplusTokens[0].column,
        line: state.surplusTokens[0].line,
        source: state.surplusTokens.map(it => it.source).join(' '),
        tokens: state.surplusTokens,
        type: NodeType.NormalText
      });
      state.surplusTokens = [];
    }
  }

  function resetBlockConstructor() {
    state.blockConstructor.mode = BlockConstructorMode.Not;
    state.blockConstructor.tokens = [];
  }

  function flushBlockConstructor() {
    if (state.blockConstructor.tokens.length > 0) {
      const firstIndex =
        state.blockConstructor.tokens[0].type === TokenType.VerticalBar ? 1 : 0;
      const name = state.blockConstructor.tokens[firstIndex].source;
      const requiredInput =
        firstIndex + 1 >= state.blockConstructor.tokens.length
          ? ''
          : state.blockConstructor.tokens[firstIndex + 1].source;
      children.push({
        column: state.blockConstructor.tokens[0].column,
        data: {
          name,
          requiredInput
        },
        line: state.blockConstructor.tokens[0].line,
        source: state.blockConstructor.tokens.map(it => it.source).join(' '),
        tokens: state.blockConstructor.tokens,
        type: NodeType.BlockConstructor
      });
      resetBlockConstructor();
    }
  }

  for (const token of tokens) {
    if (state.escape) {
      state.surplusTokens.push(token);
      state.escape = false;
    } else if (
      state.blockConstructor.mode === BlockConstructorMode.HeadSupplied
    ) {
      if (token.type === TokenType.CurlyBracketStart) {
        state.blockConstructor.tokens.push(token);
        state.blockConstructor.mode = BlockConstructorMode.Body;
      } else if (token.type === TokenType.LineFeed) {
        flushBlockConstructor();
      } else {
        flush();
        state.blockConstructor.tokens.push(token);
      }
    } else if (
      state.blockConstructor.mode === BlockConstructorMode.HeadNormal &&
      token.type === TokenType.NormalText &&
      blockConstructorNormalNames.includes(token.source)
    ) {
      state.blockConstructor.tokens.push(token);
      state.blockConstructor.mode = BlockConstructorMode.HeadSupplied;
    } else {
      if (state.blockConstructor.mode === BlockConstructorMode.HeadNormal) {
        state.surplusTokens.push(state.blockConstructor.tokens[0]);
        resetBlockConstructor();
      }
      switch (token.type) {
        case TokenType.BackSlash: {
          state.escape = true;
          break;
        }
        case TokenType.NormalText: {
          if (
            (before === null || before.type === TokenType.LineFeed) &&
            blockConstructorSpecialNames.includes(token.source)
          ) {
            state.blockConstructor.mode = BlockConstructorMode.HeadSupplied;
            state.blockConstructor.tokens.push(token);
          } else if (state.decorator) {
            if (state.decorator.functionMode === DecoratorFunctionMode.Name) {
              state.decorator.functions.push({
                arguments: [],
                name: token.source
              });
            } else if (
              state.decorator.functionMode ===
              DecoratorFunctionMode.ArgumentString
            ) {
              const [lastFunction] = state.decorator.functions.slice(-1);
              lastFunction.arguments.push(token.source);
            } else if (state.decorator.functions.length !== 0) {
              throw Error('Decorator must not contains two or more texts');
            }
            state.decorator.tokens.push(token);
          } else {
            state.surplusTokens.push(token);
          }
          break;
        }
        case TokenType.CurlyBracketStart: {
          state.surplusTokens.push(token);
          break;
        }
        case TokenType.LineFeed: {
          if (before && before.type === TokenType.LineFeed) {
            flush();
            children.push({
              column: token.column,
              line: token.line,
              source: token.source,
              tokens: [token],
              type: NodeType.ParagraphSplit
            });
          }
          break;
        }
        case TokenType.SquareBracketStart: {
          if (state.decorator === false) {
            state.decorator = {
              functionMode: DecoratorFunctionMode.Not,
              functions: [],
              tokens: []
            };
          }
          state.decorator.tokens.push(token);
          break;
        }
        case TokenType.SquareBracketEnd: {
          if (state.decorator) {
            state.decorator.tokens.push(token);
            if (
              state.decorator.functionMode !== DecoratorFunctionMode.Not &&
              state.decorator.functionMode !== DecoratorFunctionMode.Name
            ) {
              throw new Error(
                `Incompleted function: ${
                  state.decorator.functions.slice(-1)[0].name
                }`
              );
            }
            children.push({
              column: state.decorator.tokens[0].column,
              data: {
                functions: state.decorator.functions,
                input: state.decorator.requiredInput
              } as DecoratorData,
              line: state.decorator.tokens[0].line,
              source: state.decorator.tokens.map(it => it.source).join(' '),
              tokens: state.decorator.tokens,
              type: NodeType.Decorator
            });
            state.decorator.functionMode = DecoratorFunctionMode.Not;
            state.decorator = false;
          } else {
            state.surplusTokens.push(token);
          }
          break;
        }
        case TokenType.SingleQuote: {
          if (state.decorator) {
            if (state.decorator.functionMode === DecoratorFunctionMode.Not) {
              if (state.decorator.functions.length === 0) {
                state.decorator.requiredInput = state.decorator.tokens
                  .slice(1)
                  .map(it => it.source)
                  .join(' ');
              }
              state.decorator.functionMode = DecoratorFunctionMode.Name;
            }
            state.decorator.tokens.push(token);
          } else {
            state.surplusTokens.push(token);
          }
          break;
        }
        case TokenType.RoundBracketStart: {
          if (
            state.decorator &&
            state.decorator.functionMode === DecoratorFunctionMode.Name
          ) {
            state.decorator.tokens.push(token);
            state.decorator.functionMode = DecoratorFunctionMode.ArgumentString;
          } else {
            state.surplusTokens.push(token);
          }
          break;
        }
        case TokenType.RoundBracketEnd: {
          if (state.decorator) {
            if (
              state.decorator.functionMode ===
              DecoratorFunctionMode.ArgumentString
            ) {
              state.decorator.tokens.push(token);
              state.decorator.functionMode = DecoratorFunctionMode.Not;
            } else {
              throw new Error('Invalid round bracket closing');
            }
          } else {
            state.surplusTokens.push(token);
          }
          break;
        }
        case TokenType.VerticalBar: {
          if (!before || before.type === TokenType.LineFeed) {
            state.blockConstructor.mode = BlockConstructorMode.HeadNormal;
            state.blockConstructor.tokens.push(token);
          } else {
            state.surplusTokens.push(token);
          }
          break;
        }
      }
    }
    before = token;
    state.next();
  }

  flush();
  flushBlockConstructor();

  return children;
}
