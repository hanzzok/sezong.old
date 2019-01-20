import { NodeType } from '../../../api/node';
import { OptionalInput } from '../../../api/optional-input';
import { Token, TokenType } from '../../../api/token';
import { ParseState } from '../parser-state';

export function nextBlockConstructorTail(tokens: Token[], state: ParseState) {
  const name = tokens.slice(-1)[0];
  tokens.push.apply(tokens, state.skipWhitespace());
  const requiredInput = state.until(
    (token: Token) =>
      token.type !== TokenType.LineFeed &&
      token.type !== TokenType.CurlyBracketStart,
    false
  );
  tokens.push.apply(tokens, requiredInput);

  const [optionalInputTokens, data] = nextBlockConstructorOptionalInput(state);

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
  state: ParseState
): [Token[], OptionalInput] {
  if (!state.hasCurrent(TokenType.CurlyBracketStart)) {
    return [[], undefined];
  }
  const tokens = [state.cursorNext()];

  const nextData = () =>
    state.until(
      token =>
        token.type !== TokenType.Assign &&
        token.type !== TokenType.Comma &&
        token.type !== TokenType.CurlyBracketEnd,
      false
    );
  let data = nextData();
  let assignState: null | Token[] = null;
  const result: Array<string | [string, string]> = [];
  const process = () => {
    if (assignState) {
      result.push([
        assignState
          .map(it => it.source)
          .join('')
          .trim(),
        data
          .map(it => it.source)
          .join('')
          .trim()
      ]);
      assignState = null;
    } else if (
      data.length > 0 &&
      data.some(
        it => it.type !== TokenType.WhiteSpace && it.type !== TokenType.LineFeed
      )
    ) {
      result.push(data.map(it => it.source).join(''));
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

  if (result.length === 0 && typeof result[0] === 'string') {
    return [tokens, result[0]];
  }

  return [tokens, result];
}
