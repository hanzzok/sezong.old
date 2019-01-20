import { NormalText } from '../../api/renderable';
import { Renderer } from '../../api/renderer';
import { HtmlPlatform } from './html-platform';

export const NormalTextRenderer: Renderer<NormalText, string> = {
  canRender: renderable => renderable instanceof NormalText,
  platform: HtmlPlatform,
  render: it => it.data
};
