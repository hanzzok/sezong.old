import { TokenType } from '../../../api/token';
import ParserConfiguration from '../parser-configuration';
import { ParseState } from '../parser-state';
import { Result } from '../types';
import { nextBlockConstructorTail } from './block-constructor-tail';
import nextNormalText from './normal-text';

export function nextSpecialBlockConstructor(
  configuration: ParserConfiguration,
  state: ParseState
): Result {
  if (
    !state.hasCurrent(TokenType.NormalText) ||
    !configuration.blockConstructorSpecialNames.includes(
      state.currentToken.source
    )
  ) {
    return nextNormalText(state);
  }

  return nextBlockConstructorTail([state.cursorNext()], state);
}
