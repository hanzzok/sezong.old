import Renderable from './renderable';
import { Renderer } from './renderer';
export class Platform<Result> {
  public renderers: Set<Renderer<any, Result>> = new Set();

  constructor(
    public readonly name: string,
    private readonly composer: (left: Result, right: Result) => Result,
    private readonly defaultValue: Result
  ) {}

  public render(renderable: Renderable): Result {
    for (const renderer of this.renderers.values()) {
      if (renderer.canRender(renderable)) {
        return renderer.render(renderable);
      }
    }

    throw new Error(
      `Unable to render ${renderable.debug()} on ${this.name} platform.`
    );
  }

  public compose(array: Result[]): Result {
    return array.reduce(this.composer, this.defaultValue);
  }
}
