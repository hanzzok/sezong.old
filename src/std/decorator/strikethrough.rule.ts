import { RenderableInline } from '../../api/render/renderable.inline';
import { RenderableText } from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const StrikethroughRule: Decorator<StrikethroughText> = {
  compile(input: RenderableInline): StrikethroughText {
    return new StrikethroughText(input);
  },
  name: 'strikethrough',
  namespace: 'std'
};

export class StrikethroughText extends RenderableText {
  constructor(data: RenderableInline) {
    super(data);
  }

  public debug(): string {
    return `Strikethrough(${this.data.debug()})`;
  }
}
