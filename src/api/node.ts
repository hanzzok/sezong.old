import { BlockOptionalInput } from './optional-input';
import { Pos } from './pos';
import { Token } from './token';

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
  readonly requiredInput: string;
  readonly optionalInput?: BlockOptionalInput;
}

export enum NodeType {
  NormalText = 'NormalText',
  ParagraphSplit = 'ParagraphSplit',

  Decorator = 'Decorator',
  BlockConstructor = 'BlockConstructor'
}
