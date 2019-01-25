import { TokenType } from '../../../api/token';
import { CompilerConfiguration } from '../../../core';
import ParseState from '../parser-state';
import { Result } from '../types';
import nextBlockConstructorTail from './block-constructor-tail';
import nextNormalText from './normal-text';

export default function nextSpecialBlockConstructor(
  configuration: CompilerConfiguration,
  state: ParseState
): Result {
  if (
    !state.hasCurrent(TokenType.NormalText) ||
    !(state.currentToken.source in configuration.blockConstructorSpecialNames)
  ) {
    return nextNormalText(state);
  }

  return nextBlockConstructorTail([state.cursorNext()], state);
}
