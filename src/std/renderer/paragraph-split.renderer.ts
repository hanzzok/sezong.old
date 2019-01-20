import { ParagraphSplitBlock } from '../../api/renderable';
import { Renderer } from '../../api/renderer';
import { HtmlPlatform } from './html-platform';

export const ParagraphSplitRenderer: Renderer<ParagraphSplitBlock, string> = {
  canRender: renderable => renderable instanceof ParagraphSplitBlock,
  platform: HtmlPlatform,
  render: _ => `<br/>`
};
