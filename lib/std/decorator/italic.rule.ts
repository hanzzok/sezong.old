import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const ItalicRule: Decorator<{}, ItalicText> = {
  compile(requiredInput: string): ItalicText {
    return new ItalicText(requiredInput);
  },
  name: 'italic',
  namespace: 'std'
};

export class ItalicText implements RenderableText {
  public readonly source: string;

  constructor(source: string) {
    this.source = source;
  }
}
