import { Token, TokenType } from '../api/token';
// import { Regex } from '../util';
import Cache from './cache';
import TokenizerState from './tokenizer.state';

export default function tokenize(
  input: string | TemplateStringsArray
): Token[] {
  const tokens = [] as Token[];

  const cache = new Cache();
  const state = new TokenizerState();

  const chars: {
    [char: string]: TokenType;
  } = {
    "'": TokenType.SingleQuote,
    '(': TokenType.RoundBracketStart,
    ')': TokenType.RoundBracketEnd,
    ',': TokenType.Comma,
    '=': TokenType.Assign,
    '[': TokenType.SquareBracketStart,
    '\\': TokenType.BackSlash,
    ']': TokenType.SquareBracketEnd,
    '{': TokenType.CurlyBracketStart,
    '|': TokenType.VerticalBar,
    '}': TokenType.CurlyBracketEnd
  };

  const source =
    typeof input === 'string' ? input : input.reduce((a, b) => a.concat(b), '');

  for (const char of source) {
    if (state.beforeWhitespace) {
      cache.appendTokenTo(tokens, TokenType.NormalText);
      if (char === '\n') {
        cache.append(state, '\n', true);
        cache.appendTokenTo(tokens, TokenType.ParagraphSplit);
        state.nextLine();
      } else if (state.column === 0) {
        tokens.push({
          column: state.column,
          line: state.line,
          source: '\n',
          type: TokenType.LineFeed
        });
      }
    }
    if (char === '\n') {
      cache.appendTokenTo(tokens, TokenType.NormalText);
      state.nextLine();
      continue;
    } else if (char in chars) {
      cache.appendTokenTo(tokens, TokenType.NormalText);
      cache.append(state, char);
      cache.appendTokenTo(tokens, chars[char]);
    } else if (char === ' ') {
      cache.appendTokenTo(tokens, TokenType.NormalText);
      cache.append(state, char);
    } else {
      cache.append(state, char);
    }

    state.next();
  }

  cache.appendTokenTo(tokens, TokenType.NormalText);

  return tokens;
}
