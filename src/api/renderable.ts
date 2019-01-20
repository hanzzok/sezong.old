export interface Renderable {
  debug(): string;
}

export abstract class RenderableBlock implements Renderable {
  public abstract debug(): string;
}

export class ParagraphSplitBlock extends RenderableBlock {
  public static instance: ParagraphSplitBlock = new ParagraphSplitBlock();

  private constructor() {
    super();
  }
  public debug(): string {
    return `ParagraphSplit`;
  }
}

export abstract class RenderableInline implements Renderable {
  public abstract readonly isEmpty: boolean;
  public abstract debug(): string;
}

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

export abstract class RenderableText implements RenderableInline {
  public readonly isEmpty: boolean;

  constructor(public readonly data: RenderableInline) {
    this.isEmpty = data.isEmpty;
  }

  public abstract debug(): string;
}
