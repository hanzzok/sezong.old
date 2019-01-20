import { Renderer } from '../../../api/renderer';
import { BoldText } from '../../decorator/bold.rule';
import { HtmlPlatform } from '../html-platform';

export const BoldRenderer: Renderer<BoldText, string> = {
  canRender: renderable => renderable instanceof BoldText,
  platform: HtmlPlatform,
  render: text => `<b>${HtmlPlatform.render(text.data)}</b>`
};
