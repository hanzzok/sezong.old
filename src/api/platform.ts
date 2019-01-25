import { NormalText, ParagraphSplitBlock, Renderable, Renderer } from './';
export class Platform<Result, MidResult = Result> {
  public renderers: Set<Renderer<any, MidResult>> = new Set();

  constructor(
    public readonly name: string,
    public readonly compose: (midResults: MidResult[]) => Result,
    renderNormalText: (text: NormalText) => MidResult,
    renderParagraphSplit: (paragraphSplit: ParagraphSplitBlock) => MidResult
  ) {
    this.renderers.add({
      canRender: renderable => renderable instanceof NormalText,
      platform: this,
      render: renderNormalText
    });
    this.renderers.add({
      canRender: renderable => renderable instanceof ParagraphSplitBlock,
      platform: this,
      render: renderParagraphSplit
    });
  }

  public render(renderable: Renderable): MidResult {
    for (const renderer of this.renderers.values()) {
      if (renderer.canRender(renderable)) {
        return renderer.render(renderable);
      }
    }

    throw new Error(
      `Unable to render ${renderable.debug()} on ${this.name} platform.`
    );
  }

  public renderAll(renderables: Renderable[]): Result {
    const results: MidResult[] = [];
    for (const renderable of renderables) {
      results.push(this.render(renderable));
    }

    return this.compose(results);
  }
}
