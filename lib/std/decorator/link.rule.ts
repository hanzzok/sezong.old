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

export class LinkText implements RenderableText {
  public readonly data: RenderableInline;
  public readonly url: string;

  constructor(data: RenderableInline, url: string) {
    this.data = data;
    this.url = url;
  }
}
