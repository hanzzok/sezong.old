import { RenderableInline, RenderableText } from '../../api/renderable';
import { Decorator } from '../../api/rule';

export const ItalicRule: Decorator<ItalicText> = {
  compile(input: RenderableInline): ItalicText {
    return new ItalicText(input);
  },
  name: 'italic',
  namespace: 'std'
};

export class ItalicText extends RenderableText {
  constructor(data: RenderableInline) {
    super(data);
  }

  public debug(): string {
    return `Italic(${this.data.debug()})`;
  }
}
