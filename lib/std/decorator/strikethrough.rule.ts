import RenderableInline from '../../api/render/renderable.inline';
import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const StrikethroughRule: Decorator<{}, StrikethroughText> = {
  compile(input: RenderableInline): StrikethroughText {
    return new StrikethroughText(input);
  },
  name: 'strikethrough',
  namespace: 'std'
};

export class StrikethroughText implements RenderableText {
  public readonly data: RenderableInline;

  constructor(data: RenderableInline) {
    this.data = data;
  }
}
