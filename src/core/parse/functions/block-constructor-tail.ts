import { NodeType } from '../../../api/node';
import { BlockOptionalInput } from '../../../api/optional-input';
import { Token, TokenType } from '../../../api/token';
import { ParseState } from '../parser-state';
import { Result } from '../types';

export function nextBlockConstructorTail(
  tokens: Token[],
  receiveDocument: boolean,
  state: ParseState
): Result {
  const name = tokens.slice(-1)[0];
  tokens.push.apply(tokens, state.skipWhitespace());
  const requiredInput = state.until(
    (token: Token) =>
      token.type !== TokenType.LineFeed &&
      token.type !== TokenType.CurlyBracketStart
  );
  tokens.push.apply(tokens, requiredInput);

  const [optionalInputTokens, data] = nextBlockConstructorOptionalInput(
    receiveDocument,
    state
  );

  tokens.push.apply(tokens, optionalInputTokens);

  return {
    data: {
      name: name.source,
      optionalInput: data,
      requiredInput: requiredInput
        .map(it => it.source)
        .join('')
        .trim()
    },
    pos: tokens[0].pos,
    tokens,
    type: NodeType.BlockConstructor
  };
}

function nextBlockConstructorOptionalInput(
  receiveDocument: boolean,
  state: ParseState
): [Token[], BlockOptionalInput] {
  if (!state.hasCurrent(TokenType.CurlyBracketStart)) {
    return [[], undefined];
  }
  const tokens = [state.cursorNext()];

  let curly = 1;

  if (receiveDocument) {
    const document = state.until(
      token => {
        if (token.type === TokenType.CurlyBracketStart) {
          curly++;
        } else if (token.type === TokenType.CurlyBracketEnd) {
          curly--;
        }
        return curly !== 0;
      },
      {
        escape: false
      }
    );
    return [tokens.concat(document), document.map(it => it.source).join('')];
  }

  const nextData = () =>
    state.until(token => {
      if (token.type === TokenType.CurlyBracketStart) {
        curly++;
      } else if (token.type === TokenType.CurlyBracketEnd) {
        curly--;
      }
      return (
        token.type !== TokenType.Assign &&
        token.type !== TokenType.Comma &&
        curly !== 0
      );
    });
  let data = nextData();
  let assignState: null | Token[] = null;
  const result: {
    [key: string]: string;
  } = {};
  const process = () => {
    if (assignState !== data && assignState) {
      result[
        assignState
          .map(it => it.source)
          .join('')
          .trim()
      ] = data
        .map(it => it.source)
        .join('')
        .trim();
      assignState = null;
    } else if (
      data.length > 0 &&
      data.some(
        it => it.type !== TokenType.WhiteSpace && it.type !== TokenType.LineFeed
      )
    ) {
      // warning message be ignored
      data.map(it => it.source).join('');
      data = [];
    }
  };
  while (
    state.hasCurrent(TokenType.Comma) ||
    state.hasCurrent(TokenType.Assign)
  ) {
    tokens.push.apply(tokens, data);

    if (state.hasCurrent(TokenType.Comma)) {
      process();
    } else if (state.hasCurrent(TokenType.Assign)) {
      assignState = data;
    }
    tokens.push(state.cursorNext());

    data = nextData();
  }

  tokens.push.apply(tokens, data);
  process();

  tokens.push(state.cursorNext());

  return [tokens, result];
}
