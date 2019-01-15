import { AnyDecorator } from '../../api/rule/decorator';

import { AnyBlockConstructor } from '../../api/rule/blockConstructor';

import { Regex } from '../../util';

export default class ParserConfiguration {
  public readonly decoratorNames: string[] = [];
  public readonly blockConstructorSpecialNames: string[] = [];
  public readonly blockConstructorNormalNames: string[] = [];

  constructor(
    decorators: AnyDecorator[],
    blockConstructors: AnyBlockConstructor[]
  ) {
    this.decoratorNames = decorators.map(it => it.name);
    for (const blockConstructor of blockConstructors) {
      if (Regex.SpecialCharacter.test(blockConstructor.name[0])) {
        this.blockConstructorSpecialNames.push(blockConstructor.name);
      } else {
        this.blockConstructorNormalNames.push(blockConstructor.name);
        this.blockConstructorNormalNames.push(
          blockConstructor.namespace + ':' + blockConstructor.name
        );
      }
    }
  }
}
