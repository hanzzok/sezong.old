import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const UnderlineRule: Decorator<{}, UnderlineText> = {
  compile(requiredInput: string): UnderlineText {
    return new UnderlineText(requiredInput);
  },
  name: 'underline',
  namespace: 'std'
};

export class UnderlineText implements RenderableText {
  public readonly source: string;

  constructor(source: string) {
    this.source = source;
  }
}
