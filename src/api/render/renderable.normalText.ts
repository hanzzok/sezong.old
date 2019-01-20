import RenderableInline from './renderable.inline';

export class NormalText implements RenderableInline {
  public readonly data: string;
  public readonly isEmpty: boolean;

  constructor(data: string) {
    this.data = data;
    this.isEmpty = this.data.length <= 0;
  }

  public debug(): string {
    return this.data;
  }
}
