import {
  CompilerConfiguration,
  Message,
  MessageType,
  NodeType,
  Token,
  TokenType
} from '../../../core';
import { DecoratorFunctionData } from '../node';
import ParseState from '../parser-state';
import { Result } from '../types';
import nextNormalText from './normal-text';

export default function nextDecorator(
  state: ParseState,
  configuration: CompilerConfiguration
): Result {
  if (!state.hasCurrent(TokenType.SquareBracketStart) && state.hasCurrent()) {
    return nextNormalText(state, [state.cursorNext()]);
  }
  const tokens = [state.cursorNext()];
  state.skipWhitespace();
  const text = state.until(
    token =>
      token.type !== TokenType.SingleQuote &&
      token.type !== TokenType.SquareBracketEnd
  );
  tokens.push.apply(tokens, text);

  const functions: DecoratorFunctionData[] = [];

  const end = () => {
    const chunk = state.until(
      token =>
        token.type !== TokenType.LineFeed &&
        token.type !== TokenType.SquareBracketEnd,
      {
        eatLast: true
      }
    );
    tokens.push(...chunk);
    return chunk.slice(-2)[0];
  };

  let isFirst = true;

  while (!state.hasCurrent(TokenType.SquareBracketEnd)) {
    if (!state.hasCurrent(TokenType.SingleQuote)) {
      if (isFirst) {
        return nextNormalText(state, tokens);
      }
      const first = state.currentToken.pos;
      const last = end() || tokens.slice(-1)[0];
      state.messages.push(
        new Message(
          MessageType.Error,
          'Decorator must not contain two or more texts',
          first.line,
          first.column,
          last.pos.column + last.length
        )
      );
      return nextNormalText(state, tokens);
    }
    tokens.push.apply(tokens, state.skipWhitespace());
    isFirst = false;
    const functionTokens = [state.cursorNext()];
    tokens.push.apply(tokens, state.skipWhitespace());
    if (!state.hasCurrent(TokenType.NormalText)) {
      const first = tokens[0].pos;
      const last = end() || tokens.slice(-1)[0];
      state.messages.push(
        new Message(
          MessageType.Error,
          'No decorator name supplied',
          first.line,
          first.column,
          last.pos.column + last.length
        )
      );
    }
    const nameToken = state.cursorNext();
    functionTokens.push(nameToken);

    if (state.hasCurrent(TokenType.RoundBracketStart)) {
      const bracketStart = state.cursorNext();
      functionTokens.push(bracketStart);
      const parameter: Token[] = state.until(
        token =>
          token.type !== TokenType.RoundBracketEnd &&
          token.type !== TokenType.SquareBracketEnd
      );

      functionTokens.push(...parameter);
      if (!state.hasCurrent(TokenType.RoundBracketEnd)) {
        const first = bracketStart.pos;
        const last = functionTokens.slice(-1)[0];
        state.messages.push(
          new Message(
            MessageType.Error,
            'Decorator function invokation not completed',
            first.line,
            first.column,
            last.pos.column + last.length
          )
        );
        return nextNormalText(state, tokens);
      }
      functionTokens.push(state.cursorNext());
      functions.push({
        name: nameToken.source,
        parameter: [parameter.map(it => it.source).join(), parameter]
      });
    } else {
      functions.push({
        name: nameToken.source
      });
    }

    if (!configuration.decoratorNames.includes(nameToken.source)) {
      const first = functionTokens[0].pos;
      const last = functionTokens.slice(-1)[0];
      state.messages.push(
        new Message(
          MessageType.Warning,
          `Undefined decorator: ${functionTokens[1].source}`,
          first.line,
          first.column,
          last.pos.column + last.length
        )
      );
    }

    tokens.push.apply(tokens, functionTokens);
  }

  if (!state.hasCurrent(TokenType.SquareBracketEnd)) {
    return nextNormalText(state, tokens);
  }

  tokens.push(state.cursorNext());

  return {
    data: {
      functions,
      input: [
        text
          .map(it => it.source)
          .join('')
          .trim(),
        text
      ]
    },
    pos: tokens[0].pos,
    tokens,
    type: NodeType.Decorator
  };
}
