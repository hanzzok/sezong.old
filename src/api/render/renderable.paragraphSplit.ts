import { RenderableBlock } from './renderable.block';

export class ParagraphSplitBlock extends RenderableBlock {
  public static instance: ParagraphSplitBlock = new ParagraphSplitBlock();

  private constructor() {
    super();
  }
  public debug(): string {
    return `ParagraphSplit`;
  }
}
