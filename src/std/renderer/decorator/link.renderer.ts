import { Renderer } from '../../../api/render/renderer';
import { LinkText } from '../../decorator/link.rule';
import { HtmlPlatform } from '../htmlPlatform';

export const LinkRenderer: Renderer<LinkText, string> = {
  canRender: renderable => renderable instanceof LinkText,
  platform: HtmlPlatform,
  render: text => `<a href="${text.url}">${HtmlPlatform.render(text.data)}</a>`
};
