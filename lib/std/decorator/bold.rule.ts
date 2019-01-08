import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const BoldRule: Decorator<{}, BoldText> = {
  compile(requiredInput: string): BoldText {
    return new BoldText(requiredInput);
  },
  name: 'bold',
  namespace: 'std'
};

export class BoldText implements RenderableText {
  public readonly source: string;

  constructor(source: string) {
    this.source = source;
  }
}
