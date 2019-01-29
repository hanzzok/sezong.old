import { Configuration } from '../../api/configuration-store';
import { Pos, Token } from '../../core';

export interface Node {
  readonly pos: Pos;
  readonly type: NodeType;
  readonly tokens: Token[];

  readonly data?: DecoratorData | BlockConstructorData;
}

export interface DecoratorData {
  readonly input: [string, Token[]];
  readonly functions: DecoratorFunctionData[];
}
export interface DecoratorFunctionData {
  name: string;
  parameter?: [string, Token[]];
}

export interface BlockConstructorData {
  readonly name: string;
  readonly primaryInput: [string, Token[]];
  readonly configuration?: Configuration;
  readonly document?: [string, Token[]];
}

export enum NodeType {
  NormalText = 'NormalText',
  ParagraphSplit = 'ParagraphSplit',

  Decorator = 'Decorator',
  BlockConstructor = 'BlockConstructor'
}
