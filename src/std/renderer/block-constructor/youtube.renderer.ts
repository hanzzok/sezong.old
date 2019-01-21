import { Renderer } from '../../../api/renderer';
import { YoutubeBlock } from '../../block-constructor/youtube.rule';
import { HtmlPlatform } from '../html-platform';

export const YoutubeRenderer: Renderer<YoutubeBlock, string> = {
  canRender: renderable => renderable instanceof YoutubeBlock,
  platform: HtmlPlatform,
  render: youtube =>
    `<iframe class="youtube" src="https://www.youtube.com/embed/${
      youtube.videoId
    }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
};
