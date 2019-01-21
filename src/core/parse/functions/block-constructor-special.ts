import { TokenType } from '../../../api/token';
import CompilerConfiguration from '../../compiler-configuration';
import { ParseState } from '../parser-state';
import { Result } from '../types';
import { nextBlockConstructorTail } from './block-constructor-tail';
import nextNormalText from './normal-text';

export function nextSpecialBlockConstructor(
  configuration: CompilerConfiguration,
  state: ParseState
): Result {
  if (
    !state.hasCurrent(TokenType.NormalText) ||
    !(state.currentToken.source in configuration.blockConstructorSpecialNames)
  ) {
    return nextNormalText(state);
  }

  const name = state.currentToken.source;

  return nextBlockConstructorTail(
    [state.cursorNext()],
    configuration.blockConstructorSpecialNames[name].receiveDocument,
    state
  );
}
