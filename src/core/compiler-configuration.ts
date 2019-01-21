import { AnyBlockConstructor, AnyDecorator } from '../api/rule';
import { Regex } from '../util';

export default class CompilerConfiguration {
  public readonly decorators: AnyDecorator[];
  public readonly blockConstructors: AnyBlockConstructor[];

  public readonly decoratorNames: string[] = [];
  public readonly blockConstructorSpecialNames: {
    [key: string]: AnyBlockConstructor;
  } = {};
  public readonly blockConstructorNormalNames: {
    [key: string]: AnyBlockConstructor;
  } = {};

  constructor(
    decorators: AnyDecorator[],
    blockConstructors: AnyBlockConstructor[]
  ) {
    this.decorators = decorators;
    this.blockConstructors = blockConstructors;

    this.decoratorNames = decorators.map(it => it.name);
    for (const blockConstructor of blockConstructors) {
      if (Regex.SpecialCharacter.test(blockConstructor.name[0])) {
        this.blockConstructorSpecialNames[
          blockConstructor.name
        ] = blockConstructor;
      } else {
        this.blockConstructorNormalNames[
          blockConstructor.name
        ] = blockConstructor;
        this.blockConstructorNormalNames[
          blockConstructor.namespace + ':' + blockConstructor.name
        ] = blockConstructor;
      }
    }
  }
}
