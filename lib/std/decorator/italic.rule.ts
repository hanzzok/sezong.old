import RenderableInline from '../../api/render/renderable.inline';
import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const ItalicRule: Decorator<{}, ItalicText> = {
  compile(input: RenderableInline): ItalicText {
    return new ItalicText(input);
  },
  name: 'italic',
  namespace: 'std'
};

export class ItalicText implements RenderableText {
  public readonly data: RenderableInline;

  constructor(data: RenderableInline) {
    this.data = data;
  }
}
