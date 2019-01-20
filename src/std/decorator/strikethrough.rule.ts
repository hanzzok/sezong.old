import { RenderableInline, RenderableText } from '../../api/renderable';
import { Decorator } from '../../api/rule';

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
