import Renderable from './renderable';
import { Renderer } from './renderer';
export class Platform<Result> {
  public readonly name: string;
  public renderers: Set<Renderer<any, Result>> = new Set();

  constructor(name: string) {
    this.name = name;
  }

  public render(renderable: Renderable): Result {
    for (const renderer of this.renderers.values()) {
      if (renderer.canRender(renderable)) {
        return renderer.render(renderable);
      }
    }

    throw new Error(`Unable to render: ${renderable.debug()}`);
  }
}
