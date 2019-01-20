import { Token, TokenType } from '../../api/token';
import Cache from './cache';
import TokenizerState from './tokenizer-state';

export default function tokenize(
  input: string | TemplateStringsArray
): Token[] {
  const tokens = [] as Token[];

  const state = new TokenizerState();
  const cache = new Cache(state);
  let beforeWhitespace = false;

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
    if (char === ' ') {
      if (!beforeWhitespace) {
        cache.appendTokenTo(tokens, TokenType.NormalText);
      }
      beforeWhitespace = true;
      cache.append(char);
      continue;
    } else if (beforeWhitespace) {
      cache.appendTokenTo(tokens, TokenType.WhiteSpace);
      beforeWhitespace = false;
    }
    if (char === '\n') {
      cache.appendTokenTo(tokens, TokenType.NormalText);
      cache.append(char);
      cache.appendTokenTo(tokens, TokenType.LineFeed);
      state.nextLine();
      continue;
    } else if (char in chars) {
      cache.appendTokenTo(tokens, TokenType.NormalText);
      cache.append(char);
      cache.appendTokenTo(tokens, chars[char]);
    } else {
      cache.append(char);
    }

    state.next();
  }

  cache.appendTokenTo(tokens, TokenType.NormalText);

  return tokens;
}
