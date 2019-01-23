import {
  BlockOptionalInput,
  NodeType,
  ObjectBlockOptionalInput,
  Token,
  TokenType
} from '../../../api';
import ParseState from '../parser-state';
import { Result } from '../types';

export default function nextBlockConstructorTail(
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
    tokens,
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
  parentTokens: Token[],
  receiveDocument: boolean,
  state: ParseState
): [Token[], BlockOptionalInput] {
  if (!state.hasCurrent(TokenType.CurlyBracketStart)) {
    return [[], { tokens: parentTokens, value: undefined }];
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
    tokens.push.apply(tokens, document);
    tokens.push(state.cursorNext());
    return [
      tokens,
      {
        tokens,
        value: document.map(it => it.source).join('')
      }
    ];
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
  const value: ObjectBlockOptionalInput = {};
  const process = () => {
    if (assignState !== data && assignState) {
      value[
        assignState
          .map(it => it.source)
          .join('')
          .trim()
      ] = {
        keyTokens: assignState,
        real: data
          .map(it => it.source)
          .join('')
          .trim(),
        valueTokens: data
      };
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

  return [tokens, { tokens, value }];
}
