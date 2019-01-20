import { RenderableInline, RenderableText } from '../../api/renderable';
import { Decorator } from '../../api/rule';

export const BoldRule: Decorator<BoldText> = {
  compile(input: RenderableInline): BoldText {
    return new BoldText(input);
  },
  name: 'bold',
  namespace: 'std'
};

export class BoldText extends RenderableText {
  constructor(data: RenderableInline) {
    super(data);
  }

  public debug(): string {
    return `Bold(${this.data.debug()})`;
  }
}
