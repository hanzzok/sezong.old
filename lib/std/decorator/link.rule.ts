import RenderableText from '../../api/render/renderable.text';
import Decorator from '../../api/rule/decorator';

export const LinkRule: Decorator<string, LinkText> = {
  compile(requiredInput: string, url: string): LinkText {
    return new LinkText(requiredInput, url);
  },
  name: 'link',
  namespace: 'std'
};

export class LinkText implements RenderableText {
  public readonly source: string;
  public readonly url: string;

  constructor(source: string, url: string) {
    this.source = source;
    this.url = url;
  }
}
