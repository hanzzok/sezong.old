import { TokenType } from '../../../api/token';
import ParserConfiguration from '../parser-configuration';
import { ParseState } from '../parser-state';
import { Result } from '../types';
import { nextBlockConstructorTail } from './block-constructor-tail';
import nextNormalText from './normal-text';

export function nextNormalBlockConstructor(
  configuration: ParserConfiguration,
  state: ParseState
): Result {
  if (!state.hasCurrent(TokenType.VerticalBar)) {
    return nextNormalText(state);
  }
  const tokens = [state.cursorNext()];
  tokens.push.apply(tokens, state.skipWhitespace());
  if (
    !state.hasCurrent(TokenType.NormalText) ||
    !configuration.blockConstructorNormalNames.includes(
      state.currentToken.source
    )
  ) {
    return nextNormalText(state, tokens);
  }
  tokens.push(state.cursorNext());

  return nextBlockConstructorTail(tokens, state);
}
