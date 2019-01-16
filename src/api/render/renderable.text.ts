import RenderableInline from './renderable.inline';

export default abstract class RenderableText implements RenderableInline {
  constructor(public readonly data: RenderableInline) {}

  public abstract debug(): string;
}
