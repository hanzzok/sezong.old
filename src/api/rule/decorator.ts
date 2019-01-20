import RenderableInline from '../render/renderable.inline';
import Rule from './rule';

export default interface Decorator<
  OptionalInput,
  Result extends RenderableInline
> extends Rule<RenderableInline, OptionalInput, Result> {
  readonly reduceIfTextEmpty?: false | null;
}

export type AnyDecorator = Decorator<any, RenderableInline>;
