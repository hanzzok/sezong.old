import { NormalText } from '../../api/render/renderable.normalText';
import { Renderer } from '../../api/render/renderer';
import { HtmlPlatform } from './htmlPlatform';

export const NormalTextRenderer: Renderer<NormalText, string> = {
  canRender: renderable => renderable instanceof NormalText,
  platform: HtmlPlatform,
  render: it => it.data
};
