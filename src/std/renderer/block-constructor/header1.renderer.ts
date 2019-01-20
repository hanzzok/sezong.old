import { Renderer } from '../../../api/renderer';
import { Header1Block } from '../../blockConstructor/header1.rule';
import { HtmlPlatform } from '../html-platform';

export const Header1Renderer: Renderer<Header1Block, string> = {
  canRender: renderable => renderable instanceof Header1Block,
  platform: HtmlPlatform,
  render: header => `<h1>${header.text}</h1>`
};
