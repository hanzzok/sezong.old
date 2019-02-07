export abstract class Renderable<PropsType> {
  constructor(
    public readonly namespace: string,
    public readonly name: string,
    public readonly props: NonNullable<PropsType>
  ) {}

  public debug(): string {
    const keys = Object.keys(this.props);

    return `${this.namespace}:${this.name}${
      keys.length > 0
        ? `(${keys
            .map(it => `${it}=${(this.props as any)[it] as string}`)
            .join(', ')})`
        : ''
    }`;
  }
}

export class RenderableBlock<PropsType> extends Renderable<PropsType> {
  constructor(namespace: string, name: string, props: NonNullable<PropsType>) {
    super(namespace, name, props);
  }
}

export class ParagraphSplitBlock extends RenderableBlock<{}> {
  public static instance: ParagraphSplitBlock = new ParagraphSplitBlock();

  private constructor() {
    super('parser', 'paragraph-split', {});
  }
  public debug(): string {
    return `ParagraphSplit`;
  }
}

export abstract class RenderableInline<PropsType> extends Renderable<
  PropsType
> {
  public abstract readonly isEmpty: boolean;

  constructor(namespace: string, name: string, props: NonNullable<PropsType>) {
    super(namespace, name, props);
  }
}

export class NormalText extends RenderableInline<{}> {
  public readonly data: string;
  public readonly isEmpty: boolean;

  constructor(data: string) {
    super('parser', 'normal-text', {});
    this.data = data;
    this.isEmpty = this.data.length <= 0;
  }

  public debug(): string {
    return this.data;
  }
}

export class RenderableText<PropsType> extends RenderableInline<PropsType> {
  public readonly isEmpty: boolean;

  constructor(
    namespace: string,
    name: string,
    props: NonNullable<PropsType>,
    public readonly data: RenderableInline<unknown>
  ) {
    super(namespace, name, props);
    this.isEmpty = data.isEmpty;
  }
}
