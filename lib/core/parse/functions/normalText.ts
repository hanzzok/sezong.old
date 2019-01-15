import { Token, TokenType } from '../../../api/token';

import { Node, NodeType } from '../../../api/node';
import { ParseState } from '../parser.state';

export default function nextNormalText(
  state: ParseState,
  readTokens: Token[] = []
): Node | null {
  const tokens = readTokens.concat(
    state.until((prev, current) => {
      if (prev && prev.type === TokenType.BackSlash) {
        return true;
      }
      switch (current.type) {
        case TokenType.SquareBracketStart:
        case TokenType.LineFeed:
          return false;
        default:
          return true;
      }
    }, false)
  );
  return tokens.length > 0
    ? {
        pos: tokens[0].pos,
        tokens,
        type: NodeType.NormalText
      }
    : null;
}
