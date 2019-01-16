import { NodeType } from '../../../api/node';
import { Token, TokenType } from '../../../api/token';
import { Message, MessageType } from '../../message';
import ParserConfiguration from '../parser.configuration';
import { ParseState } from '../parser.state';
import { Result } from '../types';
import nextNormalText from './normalText';

export default function nextDecorator(
  state: ParseState,
  configuration: ParserConfiguration
): Result {
  if (!state.hasCurrent(TokenType.SquareBracketStart)) {
    return nextNormalText(state, [state.cursorNext()]);
  }
  const tokens = [state.cursorNext()];
  state.skipWhitespace();
  const text = state.until(
    (prev, current) =>
      (current.type !== TokenType.SingleQuote &&
        current.type !== TokenType.SquareBracketEnd) ||
      (prev !== null && prev.type === TokenType.BackSlash),
    false
  );
  tokens.push.apply(tokens, text);

  const functions = [];

  const end = () => {
    const chunk = state.until(
      (token: Token) =>
        token.type !== TokenType.LineFeed &&
        token.type !== TokenType.SquareBracketEnd,
      true
    );
    return chunk.slice(-2)[0];
  };

  let first = true;

  while (!state.hasCurrent(TokenType.SquareBracketEnd)) {
    if (!state.hasCurrent(TokenType.SingleQuote)) {
      if (first) {
        return nextNormalText(state, tokens);
      }
      return new Message(
        MessageType.Error,
        'Decorator must not contain two or more texts',
        state.currentToken,
        end() || tokens.slice(-1)[0]
      );
    }
    tokens.push.apply(tokens, state.skipWhitespace());
    first = false;
    const functionTokens = [state.cursorNext()];
    tokens.push.apply(tokens, state.skipWhitespace());
    if (!state.hasCurrent(TokenType.NormalText)) {
      state.messages.push(
        new Message(
          MessageType.Error,
          'No decorator name supplied',
          tokens[0],
          end() || tokens.slice(-1)[0]
        )
      );
    }
    const nameToken = state.cursorNext();
    functionTokens.push(nameToken);

    if (state.hasCurrent(TokenType.RoundBracketStart)) {
      functionTokens.push(state.cursorNext());
      const parameters = state.until(
        (prev, current) =>
          (current.type !== TokenType.RoundBracketEnd &&
            current.type !== TokenType.SquareBracketEnd) ||
          (prev !== null && prev.type === TokenType.BackSlash),
        false
      );
      functionTokens.push.apply(functionTokens, parameters);
      if (!state.hasCurrent(TokenType.RoundBracketEnd)) {
        return new Message(
          MessageType.Error,
          'Decorator function invokation not completed',
          parameters[0],
          parameters.slice(-1)[0]
        );
      }
      functionTokens.push(state.cursorNext());
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

    if (!configuration.decoratorNames.includes(nameToken.source)) {
      const last = functionTokens.slice(-1)[0];
      state.messages.push(
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

  if (!state.hasCurrent(TokenType.SquareBracketEnd)) {
    return nextNormalText(state, tokens);
  }

  tokens.push(state.cursorNext());

  return {
    data: {
      functions,
      input: text
        .map(it => it.source)
        .join('')
        .trim()
    },
    pos: tokens[0].pos,
    tokens,
    type: NodeType.Decorator
  };
}
