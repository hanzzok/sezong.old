import { Renderer } from '../../../api/render/renderer';
import { BoldText } from '../../decorator/bold.rule';
import { HtmlPlatform } from '../htmlPlatform';

export const BoldRenderer: Renderer<BoldText, string> = {
  canRender: renderable => renderable instanceof BoldText,
  platform: HtmlPlatform,
  render: text => `<b>${HtmlPlatform.render(text.data)}</b>`
};
