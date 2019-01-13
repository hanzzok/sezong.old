import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const StrikethroughRule: Decorator<{}, StrikethroughText> = {
  compile(requiredInput: string): StrikethroughText {
    return new StrikethroughText(requiredInput);
  },
  name: 'strikethrough',
  namespace: 'std'
};

export class StrikethroughText implements RenderableText {
  public readonly source: string;

  constructor(source: string) {
    this.source = source;
  }
}
