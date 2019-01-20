import { RenderableInline } from './renderable.inline';

export abstract class RenderableText implements RenderableInline {
  public readonly isEmpty: boolean;

  constructor(public readonly data: RenderableInline) {
    this.isEmpty = data.isEmpty;
  }

  public abstract debug(): string;
}
