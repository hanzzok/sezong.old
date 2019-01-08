import { Token } from './token';

export interface Node {
  readonly line: number;
  readonly column: number;

  readonly source: string;
  readonly type: NodeType;
  readonly tokens: Token[];

  readonly data?: DecoratorData | BlockConstructorData;
}

export interface DecoratorData {
  readonly input: string;
  readonly functions: Array<{
    name: string;
    arguments: string[];
  }>;
}

export interface BlockConstructorData {
  readonly name: string;
  readonly requiredInput: string;
  readonly optionalInput?: any;
}

export enum NodeType {
  Root = 'Root',

  NormalText = 'NormalText',
  ParagraphSplit = 'ParagraphSplit',

  Decorator = 'Decorator',
  BlockConstructor = 'BlockConstructor'
}
