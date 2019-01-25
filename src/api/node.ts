import { Pos, Token } from './';
import { Configuration } from './configuration';

export interface Node {
  readonly pos: Pos;
  readonly type: NodeType;
  readonly tokens: Token[];

  readonly data?: DecoratorData | BlockConstructorData;
}

export interface DecoratorData {
  readonly input: string;
  readonly functions: DecoratorFunctionData[];
}
export interface DecoratorFunctionData {
  name: string;
  parameters: string[];
}

export interface BlockConstructorData {
  readonly name: string;
  readonly primaryInput: string;
  readonly configuration: Configuration | undefined;
  readonly document: string | undefined;
}

export enum NodeType {
  NormalText = 'NormalText',
  ParagraphSplit = 'ParagraphSplit',

  Decorator = 'Decorator',
  BlockConstructor = 'BlockConstructor'
}
