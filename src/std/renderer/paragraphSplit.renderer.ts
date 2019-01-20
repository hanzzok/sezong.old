import { ParagraphSplitBlock } from '../../api/render/renderable.paragraphSplit';
import { Renderer } from '../../api/render/renderer';
import { HtmlPlatform } from './htmlPlatform';

export const ParagraphSplitRenderer: Renderer<ParagraphSplitBlock, string> = {
  canRender: renderable => renderable instanceof ParagraphSplitBlock,
  platform: HtmlPlatform,
  render: _ => `<br/>`
};
