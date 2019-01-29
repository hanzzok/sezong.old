import { Configuration } from '../../../api/configuration-store';
import { NodeType, Token, TokenType } from '../../../core';
import ParseState from '../parser-state';
import { Result } from '../types';

export default function nextBlockConstructorTail(
  tokens: Token[],
  state: ParseState
): Result {
  const name = tokens.slice(-1)[0];
  tokens.push(...state.skipWhitespace());

  const primaryInput = state.until(
    (token: Token) =>
      token.type !== TokenType.LineFeed &&
      token.type !== TokenType.CurlyBracketStart &&
      token.type !== TokenType.DoubleAngleBracketEnd
  );

  const [
    optionalInputTokens,
    configuration,
    document
  ] = nextBlockConstructorOptionalInput(state);

  tokens.push(...optionalInputTokens);

  return {
    data: {
      configuration,
      document,
      name: name.source,
      primaryInput: [
        primaryInput
          .map(it => it.source)
          .join('')
          .trim(),
        primaryInput
      ]
    },
    pos: tokens[0].pos,
    tokens,
    type: NodeType.BlockConstructor
  };
}

function nextBlockConstructorOptionalInput(
  state: ParseState
): [Token[], Configuration | undefined, [string, Token[]] | undefined] {
  if (
    !state.hasCurrent(TokenType.CurlyBracketStart) &&
    !state.hasCurrent(TokenType.DoubleAngleBracketEnd)
  ) {
    return [[], undefined, undefined];
  }

  const tokens = [];

  tokens.push(...state.skipWhitespace());

  let configuration: Configuration | undefined;
  if (state.hasCurrent(TokenType.CurlyBracketStart)) {
    tokens.push(state.cursorNext());
    configuration = nextConfiguration(tokens, state);
    tokens.push(...state.skipWhitespace());
  }

  let document: [string, Token[]] | undefined;
  if (state.hasCurrent(TokenType.DoubleAngleBracketEnd)) {
    tokens.push(state.cursorNext());
    document = nextDocument(tokens, state);
  }

  return [tokens, configuration, document];
}

function nextConfiguration(
  tokens: Token[],
  state: ParseState
): Configuration | undefined {
  let curly = 1;

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
  const value: Configuration = {};
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
    tokens.push(...data);

    if (state.hasCurrent(TokenType.Comma)) {
      process();
    } else if (state.hasCurrent(TokenType.Assign)) {
      assignState = data;
    }
    tokens.push(state.cursorNext());

    data = nextData();
  }

  tokens.push(...data);
  process();

  tokens.push(state.cursorNext());

  return value;
}

function nextDocument(tokens: Token[], state: ParseState): [string, Token[]] {
  let angle = 1;
  const documentTokens = state.until(
    token => {
      if (token.type === TokenType.DoubleAngleBracketEnd) {
        angle++;
      } else if (token.type === TokenType.DoubleAngleBracketStart) {
        angle--;
      }
      return angle !== 0;
    },
    {
      escape: false
    }
  );
  tokens.push(...documentTokens);
  tokens.push(state.cursorNext());

  return [
    documentTokens
      .slice(0, -1)
      .map(it => it.source)
      .join(''),
    documentTokens
  ];
}
