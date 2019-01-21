import { RenderableInline, RenderableText } from '../../api/renderable';
import { Decorator } from '../../api/rule';

export const LinkRule: Decorator<LinkText> = {
  compile(input: RenderableInline, parameter: string[]): LinkText {
    return new LinkText(input, parameter[0]);
  },
  name: 'link',
  namespace: 'std'
};

export class LinkText extends RenderableText {
  constructor(data: RenderableInline, public readonly url: string) {
    super(data);
  }

  public debug(): string {
    return `Link(${this.data.debug()}, ${this.url})`;
  }
}
