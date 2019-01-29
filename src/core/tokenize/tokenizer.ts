import { Token, TokenType } from '../../core';
import Cache from './cache';
import TokenizerState from './tokenizer-state';

export default function tokenize(
  input: string | TemplateStringsArray
): Token[] {
  const tokens = [] as Token[];

  const state = new TokenizerState();
  const cache = new Cache(state);
  let beforeWhitespace = false;
  let beforeAngleBracketStart = false;
  let beforeAngleBracketEnd = false;

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

  const freeAngleBracket = () => {
    if (beforeAngleBracketEnd) {
      cache.append('>');
      beforeAngleBracketEnd = false;
    } else if (beforeAngleBracketStart) {
      cache.append('<');
      beforeAngleBracketStart = false;
    }
  };

  const freeText = () => {
    freeAngleBracket();
    cache.appendTokenTo(tokens, TokenType.NormalText);
  };

  for (const char of source) {
    if (char === ' ') {
      if (!beforeWhitespace) {
        freeText();
      }
      beforeWhitespace = true;
      cache.append(char);
      state.next();
      continue;
    } else if (beforeWhitespace) {
      cache.appendTokenTo(tokens, TokenType.WhiteSpace);
      beforeWhitespace = false;
    }
    if (char === '\n') {
      freeText();
      cache.append(char);
      cache.appendTokenTo(tokens, TokenType.LineFeed);
      state.nextLine();
      continue;
    } else if (char in chars) {
      freeText();
      cache.append(char);
      cache.appendTokenTo(tokens, chars[char]);
    } else if (char === '>') {
      if (!beforeAngleBracketEnd) {
        beforeAngleBracketEnd = true;
      } else {
        cache.appendTokenTo(tokens, TokenType.NormalText);
        cache.append('>>');
        cache.appendTokenTo(tokens, TokenType.DoubleAngleBracketEnd);
        beforeAngleBracketEnd = false;
      }
    } else if (char === '<') {
      if (!beforeAngleBracketStart) {
        beforeAngleBracketStart = true;
      } else {
        cache.appendTokenTo(tokens, TokenType.NormalText);
        cache.append('<<');
        cache.appendTokenTo(tokens, TokenType.DoubleAngleBracketEnd);
        beforeAngleBracketStart = false;
      }
    } else {
      freeAngleBracket();
      cache.append(char);
    }

    state.next();
  }

  cache.appendTokenTo(tokens, TokenType.NormalText);

  return tokens;
}
