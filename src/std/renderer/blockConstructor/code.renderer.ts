import { Renderer } from '../../../api/render/renderer';
import { CodeBlock } from '../../blockConstructor/code.rule';
import { HtmlPlatform } from '../htmlPlatform';

export const CodeRenderer: Renderer<CodeBlock, string> = {
  canRender: renderable => renderable instanceof CodeBlock,
  platform: HtmlPlatform,
  render: code => `<pre>${code.source}</pre>`
};
