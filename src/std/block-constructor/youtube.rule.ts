import { RenderableBlock } from '../../api/renderable';
import { BlockConstructor } from '../../api/rule';

export const YoutubeRule: BlockConstructor<YoutubeBlock> = {
  compile(requiredInput: string): YoutubeBlock {
    return new YoutubeBlock(requiredInput);
  },
  name: 'youtube',
  namespace: 'std',
  receiveDocument: false
};

export class YoutubeBlock implements RenderableBlock {
  public readonly videoId: string;

  constructor(videoId: string) {
    this.videoId = videoId;
  }

  public debug(): string {
    return `Youtube(${this.videoId})`;
  }
}
