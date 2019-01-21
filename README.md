![travis](https://img.shields.io/travis/com/langsezong/sezong.svg) ![codecov](https://img.shields.io/codecov/c/github/langsezong/sezong/master.svg) ![language-top](https://img.shields.io/github/languages/top/langsezong/sezong.svg) ![snyk-vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/langsezong/sezong.svg)

# Sezong

Sezong: A new way to create document.

## Definition

- Decorator - Inline function which decorates text. receives text, returns text.
- Block Constructor - Inserts Block-level information which is not a text.
  - Special Block Constructor - Block Constructor which starts with special character in ascii.
  - Normal Block Constructor - Block Constructor which is not a Special Block Constructor.
- Preprocessor - Before tokenize, Change a little bit of source.
- Postprocessor - After parse, Change a little bit of node (normal text node only).
- Rule - Decorator, Block Constructor, Preprocessor, and Postprocessor.
- Normal Text - Just normal text.
- Escaping - Escapes something in parsing Decorator or Block Constructor.

## Syntax

- Decorator

  ```sezong
  [Text 'f1 'f2(argument) 'f3...]
  ```

- Block Constructor

  ```sezong
  specialCharacterIdentifier requiredInput
  specialCharacterIdentifier requiredInput {
    str
  }
  specialCharacterIdentifier requiredInput {
    k = v,
    k2 = v2
  }
  | identifier requiredInput
  | identifier requiredInput {
    str
  }
  | identifier requiredInput {
    k = v,
    k2 = v2
  }
  ```

- Normal Text

  ```sezong
  Write what you want to say.
  ```

- Escaping

  ```sezong
  \escape \with \\ \character.
  ```

## Rules

### Preprocessors

- (todo) Emojify - convert `:name:` to `['emoji(name)]`.

### Postprocessors

- (todo) Pretty Quote - convert pairs of qoutes to unicode quote `“”` and `‘’`.
- (todo) Typographers' Symbol - convert `+-` to `±`, `...` to `…`, `---` to `—`, `--` to `–`, `(c)` or `(C)` to `©`, `(r)` or `(R)` to ®, `(tm)` or `(TM)` to `™`, `(p)` or `(P)` to `§`.
- (todo) Smart Arrow - convert `-->`, `<--`, `<-->`, `==>`, `<==`, and `<==>` to, `→`, `←`, `↔`, `⇒`, `⇐`, `⇔`.

### Predefined Decorators

We're sure that many decorator will be separated with npm package like babel.
We'll provide a preset.

- `'italic` - make text italic
- `'bold` - make text bold
- `'underline` - make text underlined
- `'strikethrough` - add strikethrough to text
- `'kbd` - add keyboard marker to text
- `'keyinputs` - seems like `'kbd`, but support the key combination (like `Ctrl + Space`)
- `'link(url)` - link to specific url
- `'emoji(name)` - add emoji to the end of text
- `'icon(name)` - add icon to the end of text
- `'sub` - make text subscript
- `'sup` - make text subscript
- `'mark` - make text marked
- `'fn` - make text footnote
- `'abbr(meaning)` - Add abbreviations
- `'checkbox(true or false)` - Add (un)checked checkbox to end of text. not modifiable.
- `'math` - parse text as LaTeX math.
- `'userAt(platform: twitter | youtube | telegram)` - create mention.
- `'br` - add line break to end of text.

### Predefined Block Constructors

#### Special Block Constructors

- `# text { toc: boolean = true }` - heading level 1
- `## text { toc: boolean = true }` - heading level 2
- `### text { toc: boolean = true }` - heading level 3
- `#### text { toc: boolean = false }` - heading level 4
- `##### text { toc: boolean = false }` - heading level 5
- `###### text { toc: boolean = false }` - heading level 6
- `> text` - quote
- `---` - horizontal line

#### Normal Block Constructors

- `youtube videoId` - embed youtube video
- `image url { width: string = auto, height: string = auto}` - embed image
- `code language { ...texts, highlight: int[] = [] }` - code block
- `container name { ...texts }` - container block
- `include fileUrl` - include file
- `math { ...texts }` - math block
- `toc { maxIncludes: number = 3 }` - generate ToC (Table of Contents)
- `comment { ...texts }` - comment block, must be ignored

## Todos

- Native-Level Table Syntax
- Native-Level List Syntax
