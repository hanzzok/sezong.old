import RenderableInline from '../../api/render/renderable.inline';
import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const LinkRule: Decorator<string, LinkText> = {
  compile(input: RenderableInline, url: string): LinkText {
    return new LinkText(input, url);
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
