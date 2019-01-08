import RenderableBlock from '../../api/render/renderable.block';
import BlockConstructor from '../../api/rule/blockConstructor';

export const YoutubeRule: BlockConstructor<{}, YoutubeBlock> = {
  compile(requiredInput: string): YoutubeBlock {
    return new YoutubeBlock(requiredInput);
  },
  name: 'youtube',
  namespace: 'std'
};

export class YoutubeBlock implements RenderableBlock {
  public readonly videoId: string;

  constructor(videoId: string) {
    this.videoId = videoId;
  }
}
