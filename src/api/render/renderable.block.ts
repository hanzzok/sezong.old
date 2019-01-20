import Renderable from './renderable';

export abstract class RenderableBlock implements Renderable {
  public abstract debug(): string;
}
