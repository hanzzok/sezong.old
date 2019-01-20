import { Renderer } from '../../../api/render/renderer';
import { YoutubeBlock } from '../../blockConstructor/youtube.rule';
import { HtmlPlatform } from '../htmlPlatform';

export const YoutubeRenderer: Renderer<YoutubeBlock, string> = {
  canRender: renderable => renderable instanceof YoutubeBlock,
  platform: HtmlPlatform,
  render: youtube =>
    `<iframe src="https://www.youtube.com/embed/${youtube.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
};
