import RenderableInline from '../../api/render/renderable.inline';
import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const UnderlineRule: Decorator<{}, UnderlineText> = {
  compile(input: RenderableInline): UnderlineText {
    return new UnderlineText(input);
  },
  name: 'underline',
  namespace: 'std'
};

export class UnderlineText implements RenderableText {
  public readonly data: RenderableInline;

  constructor(data: RenderableInline) {
    this.data = data;
  }
}
