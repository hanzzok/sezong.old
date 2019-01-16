import { Renderer } from '../../../api/render/renderer';
import { BoldText } from '../../decorator/bold.rule';
import { HtmlPlatform } from '../htmlPlatform';

export const BoldRenderer: Renderer<BoldText, string> = {
  platform: HtmlPlatform,
  render: text => `<b>${text.data}</b>`
};
