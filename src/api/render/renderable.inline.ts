import Renderable from './renderable';

export abstract class RenderableInline implements Renderable {
  public abstract readonly isEmpty: boolean;
  public abstract debug(): string;
}
