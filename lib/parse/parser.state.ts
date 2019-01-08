import { Token } from '../api/token';

export class ParseState {
  public index: number = 0;

  public blockConstructor: BlockConstructor = {
    mode: BlockConstructorMode.Not,
    tokens: []
  };

  public surplusTokens: Token[] = [];

  public decorator: false | Decorator = false;

  public escape: boolean = false;

  public next() {
    this.index++;
  }
}

export const enum DecoratorFunctionMode {
  Not,
  Name,
  ArgumentString,
  ArgumentComma
}

export interface Decorator {
  tokens: Token[];
  functionMode: DecoratorFunctionMode;
  functions: DecoratorFunction[];
  requiredInput?: string;
}

export interface DecoratorFunction {
  name: string;
  arguments: string[];
}

export const enum BlockConstructorMode {
  Not,
  HeadNormal,
  HeadSupplied,
  Body
}

export interface BlockConstructor {
  mode: BlockConstructorMode;
  tokens: Token[];
}
