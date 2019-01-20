import { Renderer } from '../../../api/renderer';
import { LinkText } from '../../decorator/link.rule';
import { HtmlPlatform } from '../html-platform';

export const LinkRenderer: Renderer<LinkText, string> = {
  canRender: renderable => renderable instanceof LinkText,
  platform: HtmlPlatform,
  render: text => `<a href="${text.url}">${HtmlPlatform.render(text.data)}</a>`
};
