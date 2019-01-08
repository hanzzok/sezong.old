# Sezong

Programmatic Markup Language

## Definition

- Decorator<br>
  텍스트를 꾸며주는 인라인 함수입니다. 텍스트를 받아서 텍스트를 반환합니다.
- Block Constructor<br>
  텍스트 이외의 블록 레벨 정보를 넣습니다.
- Normal Text<br>
  일반 텍스트입니다.
- Escaping<br>
  역슬래시 뒤에 있는 문자 하나는 무조건 Normal Text로 판정됩니다.

## Syntax

- Decorator
  ```
  [Text 'f1 'f2(argument) 'f3...]
  ```
- Block Constructor
  ```
  specialCharacterIdentifier requiredInput
  specialCharacterIdentifier requiredInput {
    optional data
  }
  | identifier requiredInput
  | identifier requiredInput {
    optional data
  }
  ```
- Normal Text
  ```
  Write what you want to say.
  ```
- Escaping
  ```
  \escape \with \\ \character.
  ```

## Predefined Decorators

- 'i - make text italic
- 'b - make text bold
- 'u - make text underlined
- 's - add strikethrough to text
- 'kbd - add keyboard marker to text
- 'keyinputs - seems like `'kbd`, but support the key combination (like `Ctrl + Space`)
- 'link(url) - link to specific url

## Predefined Block Constructors

- \# text - heading level 1 (special char)
- \## text - heading level 2 (special char)
- \### text - heading level 3 (special char)
- \#### text - heading level 4 (special char)
- \##### text - heading level 5 (special char)
- \###### text - heading level 6 (special char)
- youtube videoId - embed youtube video
- image url - embed image
- code language { ...texts } - embed code block
- \> text - quote

## Todo

- Native-Level Table Syntax
- Native-Level List Syntax
