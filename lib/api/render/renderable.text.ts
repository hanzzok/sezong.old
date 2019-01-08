import RenderableInline from './renderable.inline';

export default interface RenderableText extends RenderableInline {
  readonly source: string;
}
