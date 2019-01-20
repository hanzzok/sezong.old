import { Token, TokenType } from '../../../api/token';

import { Node, NodeType } from '../../../api/node';
import { ParseState } from '../parser-state';

export default function nextNormalText(
  state: ParseState,
  readTokens: Token[] = []
): Node | null {
  const tokens = readTokens.concat(
    state.until(
      current =>
        current.type !== TokenType.SquareBracketStart &&
        current.type !== TokenType.LineFeed,
      false
    )
  );
  return tokens.length > 0
    ? {
        pos: tokens[0].pos,
        tokens,
        type: NodeType.NormalText
      }
    : null;
}
