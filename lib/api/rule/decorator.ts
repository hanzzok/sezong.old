import RenderableInline from '../render/renderable.inline';
import RenderableText from '../render/renderable.text';
import Rule from './rule';

export default interface Decorator<
  OptionalInput,
  Result extends RenderableText
> extends Rule<RenderableInline, OptionalInput, Result> {
  readonly reduceIfTextEmpty?: false | null;
}

export type AnyDecorator = Decorator<any, RenderableText>;
