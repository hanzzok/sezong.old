import { RenderableInline } from '../../api/render/renderable.inline';
import { RenderableText } from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

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
